resource "google_bigquery_table" "aliexpress_search_requests" {
  dataset_id = var.dataset_id
  table_id   = "aliexpress_search_requests"
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
    "name": "configuration",
    "type": "JSON"
  },
  {
    "mode": "REQUIRED",
    "name": "cron_expression",
    "type": "STRING"
  },
  {
    "defaultValueExpression": "CURRENT_TIMESTAMP",
    "name": "created_at",
    "type": "TIMESTAMP",
    "mode": "REQUIRED"
  },
  {
    "defaultValueExpression": "CURRENT_TIMESTAMP",
    "name": "updated_at",
    "mode": "REQUIRED",
    "type": "TIMESTAMP"
  },
  {
    "defaultValueExpression": "CURRENT_TIMESTAMP",
    "mode": "REQUIRED",
    "name": "last_run",
    "type": "TIMESTAMP"
  }
]
EOF
}