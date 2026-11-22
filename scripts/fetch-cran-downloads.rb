#!/usr/bin/env ruby
# 部署前运行：给 _data/home.yml 中写了 cran: true 的包，从 cranlogs 取 CRAN 累计下载量，
# 写入 _data/cran.json，首页标签显示为“CRAN · 下载 6,762”。
# 取数失败时不写该包的数字，首页只显示原标签，不影响部署。
# 用法：ruby scripts/fetch-cran-downloads.rb
require "yaml"
require "json"
require "net/http"
require "uri"

home = YAML.load_file("_data/home.yml")
pkgs = (home["packages"] || []).select { |p| p["cran"] }.map { |p| p["name"] }
out = {}
pkgs.each do |name|
  uri = URI("https://cranlogs.r-pkg.org/downloads/total/2015-01-01:last-day/#{name}")
  begin
    res = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 20) { |h| h.get(uri.request_uri) }
    raise "HTTP #{res.code}" unless res.is_a?(Net::HTTPSuccess)
    n = JSON.parse(res.body).first["downloads"].to_i
    raise "no data" if n <= 0
    out[name] = { "downloads" => n, "text" => n.to_s.reverse.scan(/\d{1,3}/).join(",").reverse }
    puts "#{name}: #{out[name]["text"]}"
  rescue => e
    warn "#{name}: 取 CRAN 下载量失败（#{e.message}），本次不显示数字"
  end
end
File.write("_data/cran.json", JSON.pretty_generate(out))
