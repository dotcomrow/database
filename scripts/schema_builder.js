import { BigQuery } from "@google-cloud/bigquery";
import { GraphQLSchema, 
  GraphQLObjectType,
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean,
  introspectionFromSchema,
  buildSchema,
  graphqlSync } from "graphql";
import fs from 'fs';
import path from 'path';
import { serializeError } from "serialize-error";
import { mergeSchemas } from '@graphql-tools/schema';
import { R2 } from 'node-cloudflare-r2';

async function main() {
  const options = {
    keyFilename: "key.json",
    projectId: "$1",
    datasetId: "$2",
  };

  const bigquery = new BigQuery(options);
  // const storage = new Storage({
  //   projectId: options.projectId,
  //   keyFilename: "storage_admin_key.json",
  // });

  const r2 = new R2({
      accountId: "$4",
      accessKeyId: "$5",
      secretAccessKey: "$6",
  });

  const bucket = r2.bucket("$3");
  // const bucket = r2.bucket("schemas");

  function getTableMetadata(table) {
    async function getTM(table) {
      const metadata = await table.getMetadata();
      return metadata;
    }
    return getTM(table);
  }

  async function uploadFile(filename) {
    
    // var generationMatchPrecondition = 0

    // const local_options = {
    //   destination: fileName,
    //   // Optional:
    //   // Set a generation-match precondition to avoid potential race conditions
    //   // and data corruptions. The request to upload is aborted if the object's
    //   // generation number does not match your precondition. For a destination
    //   // object that does not yet exist, set the ifGenerationMatch precondition to 0
    //   // If the destination object already exists in your bucket, set instead a
    //   // generation-match precondition using its generation number.
    //   preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
    // };

    // await storage.bucket(options.bucket_name).upload(fileName, local_options);

    // Set your bucket's public URL
    // bucket.provideBucketPublicUrl('https://pub-xxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev');

    // console.log(await bucket.exists());
    // true

    const upload = await bucket.uploadFile(filename, filename, {}, "application/json");
  }

  function parseType(field) {
    switch (field.type) {
      case "STRING":
        return GraphQLString;
      case "INTEGER":
        return GraphQLInt;
      case "BOOLEAN":
        return GraphQLBoolean;
      case "FLOAT":
        return GraphQLFloat;
      case "TIMESTAMP":
        return GraphQLString;
      case "DATE":
        return GraphQLString;
      case "TIME":
        return GraphQLString;
      case "DATETIME":
        return GraphQLString;
      case "GEOGRAPHY":
        return GraphQLString;
      case "NUMERIC":
        return GraphQLInt;
      default:
        return GraphQLString;
    }
  }

  async function getRegularSchema() {
    var regularFiles = fromDir('./', '.graphql');
    var adminFiles = fromDir('./', '.admin.graphql');
    regularFiles = regularFiles.filter( x => !new Set(adminFiles).has(x) );
    
    var combined = "";

    for(let x = 0; x < regularFiles.length; x++) {
      const data = fs.readFileSync(regularFiles[x],{ encoding: 'utf8', flag: 'r' });
      combined += data;
    }
    return buildSchema(combined);
  }

  async function getAdminSchema() {
    var adminFiles = fromDir('./', '.admin.graphql');
    
    var combined = "";

    for(let x = 0; x < adminFiles.length; x++) {
      const data = fs.readFileSync(adminFiles[x],{ encoding: 'utf8', flag: 'r' });
      combined += data;
      if (fs.existsSync(adminFiles[x].replace('.admin.graphql', '.graphql'))) {
        const regData = fs.readFileSync(adminFiles[x].replace('.admin.graphql', '.graphql'),{ encoding: 'utf8', flag: 'r' });
        combined += regData;
      }
    }
    var additionalSchemas = [
      "/Query.graphql",
      "/Setting.graphql",
      "/Weight.graphql",
      "/Cart.graphql",
      "/Date.graphql",
      "/Price.graphql",
      "/DateTime.graphql",
      "/Country.graphql",
      "/Province.graphql",
      "/Status.graphql",
      "/ShippingSetting.graphql",
      "/StoreSetting.graphql",
    ];
    for(let x = 0; x < additionalSchemas.length; x++) {
      var file = fromDir('./', additionalSchemas[x])[0];
      console.log(file)
      const data = fs.readFileSync(file,{ encoding: 'utf8', flag: 'r' });
      combined += data;
    }
    return buildSchema(combined);
  }

  async function fetchSchemas() {
    // const [tables] = await bigquery.dataset(options.datasetId).getTables();

    // var tableList = [];
    var graphqlObjects = [];
    // for (var table of tables) {
    //   var tableMetadata = await getTableMetadata(table);
    //   tableList.push(tableMetadata);
    // }

    // for (var metadata of tableList) {
    //   var fields = {};
    //   metadata[0].schema.fields.forEach((field) => {
    //     fields[field.name] = {
    //       type: parseType(field.type),
    //       description: field.description,
    //     };
    //   });

    //   var types = [];
    //   types.push( new GraphQLObjectType({
    //     name: metadata[0].tableReference.tableId,
    //     fields: fields,
    //   }));

    //   var graphqlSchema = new GraphQLSchema({
    //     query: new GraphQLObjectType({
    //       name: 'Query',
    //       fields: {
    //         _dummy: { type: GraphQLString }
    //       }
    //     }),
    //     types: types
    //   });

    //   graphqlObjects.push(
    //     graphqlSchema
    //   );
    // }



    return graphqlObjects;
  }

  function fromDir(startPath, filter) {

      // console.log('Starting from dir '+startPath+'/');

      if (!fs.existsSync(startPath)) {
          console.log("no dir ", startPath);
          return;
      }

      var foundList = [];
      var files = fs.readdirSync(startPath);
      for (var i = 0; i < files.length; i++) {
          var filename = path.join(startPath, files[i]);
          var stat = fs.lstatSync(filename);
          if (stat.isDirectory()) {
              fromDir(filename, filter).forEach((item) => {
                foundList.push(item);
              }); //recurse
          } else if (filename.endsWith(filter)) {
              foundList.push(filename);
          };
      };
      return foundList;
  };

  async function query() {
    // var schemas = await fetchSchemas();
    
    // const storage = new Storage();
    // const mergedSchema = mergeSchemas({
    //   schemas: schemas
    // })
    // const schema_json = introspectionFromSchema(mergedSchema);

    const regularFileName = 'graphql_schema.json';
    const adminFileName = 'graphql_admin_schema.json';

    const schema_json = introspectionFromSchema(await getRegularSchema());
    const admin_schema_json = introspectionFromSchema(await getAdminSchema());

    let json = JSON.stringify(schema_json);
    // console.log(json);

    let admin_json = JSON.stringify(admin_schema_json);
    // console.log(admin_json);

    await fs.writeFile(regularFileName, json,{ flush:true }, (err) => {
      err && console.error(err)
    });
    fs.readFile(regularFileName, 'utf8', async (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      await uploadFile(regularFileName);
    });



    await fs.writeFile(adminFileName, admin_json,{ flush:true }, (err) => {
      err && console.error(err)
    });
    fs.readFile(adminFileName, 'utf8', async (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      await uploadFile(adminFileName);
    });
  }

  try {
    await query();
  } catch (err) {
    const responseError = serializeError(err);
    console.error(responseError);
  }
}
main(...process.argv.slice(2));
