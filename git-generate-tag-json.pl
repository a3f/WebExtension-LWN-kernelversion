#!/usr/bin/env perl

use Time::Piece;
use File::stat;

chdir(shift) if @ARGV;
$repo = `git rev-parse --show-toplevel`;
chdir $repo;

$tags = `git for-each-ref --sort -taggerdate --tcl --format="{%(taggerdate:format:%s): %(refname:short)}," refs/tags/*`;
$tags =~ s/,$//;

$date_pulled = stat('.git/FETCH_HEAD');
$date_pulled = defined $date_pulled ? '"'.localtime($date_pulled->mtime)->datetime.'"' : "null";

print <<EOT;
{
  "tags": {
    "date-generated": "@{[localtime->datetime]}",
    "date-pulled": $date_pulled,
    "times": [
$tags    ]
  }
}
EOT
