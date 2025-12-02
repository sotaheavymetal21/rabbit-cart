env "local" {
  src = "file://migrations"
  url = getenv("ATLAS_DB_URL")
  dev = "docker://postgres/15/dev"
}
