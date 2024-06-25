resource "google_bigquery_dataset" "database" {
  dataset_id  = "${var.project_name}_dataset"
  description = "Dataset for ${var.project_name} project"
  location    = "US"
  project     = var.project_id

  depends_on = [google_project_service.project_service, data.google_compute_default_service_account.default]
}

module "schemas" {
  source     = "./tables"
  project_id = var.project_id
  dataset_id = google_bigquery_dataset.database.dataset_id

  depends_on = [google_bigquery_dataset.database]
}

# resource "null_resource" "build_schema" {

#   triggers = {
#     always_run = "${timestamp()}"
#   }

#   provisioner "local-exec" {
#     # environment = {
#     #   STORAGE_ADMIN_CREDENTIALS = "${var.cloud_storage_admin}"
#     # }
#     command = "${path.module}/scripts/build_graphql_schema.sh ${var.project_id} ${google_bigquery_dataset.ecomm.dataset_id} ${var.bucket_name} ${var.r2_account_id} ${var.r2_access_key_id} ${var.r2_secret_access_key}"
#   }

#   depends_on = [module.schemas]
# }
