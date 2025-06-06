try
  Genie.Util.isprecompiling() || Genie.Secrets.secret_token!("e314271a07492f06bdb8404937c9b968aa3d45e24f9cfe483c5de75c55286f10")
catch ex
  @error "Failed to generate secrets file: $ex"
end
