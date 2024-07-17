resource "google_bigquery_table" "aliexpress_search_results" {
  dataset_id = var.dataset_id
  table_id   = "aliexpress_search_results"
  deletion_protection = false
  project                     = var.project_id
  schema = <<EOF
[
  {
    "mode": "REQUIRED",
    "name": "account_id",
    "type": "STRING"
  },
  {
    "mode": "REQUIRED",
    "name": "search_request_id",
    "type": "STRING"
  },
  {
    "mode": "REQUIRED",
    "name": "result_entry",
    "type": "JSON"
  },
  {
    "defaultValueExpression": "CURRENT_TIMESTAMP",
    "name": "created_at",
    "type": "TIMESTAMP",
    "mode": "REQUIRED"
  }
]
EOF
}