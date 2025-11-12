To create or adapt test data:
- update the resources in this folder
- use vip-report to generate a new db
- Update the htsFile path in the database to remove your local paths. (use e.g. intelliJ or webstorm)
(run fixPaths.sql on all datasources)
- postfix db files with ".blob"

Parameters for vip-report:
-i "/path/to/vcf/family.vcf" -f -pb Patient -pd "/path/to/family.ped" -m "/path/to/field_metadata.json" -tc "/path/to/config_vcf.json" -st "/path/to/sampleTree.json" -dt "/path/to/decisionTree.json" -t "/path/to/template.html" -ph "HP:0000951;HP:0003124"
-i "/path/to/vcf/samples_0.vcf" -f -m "/path/to/field_metadata.json" -tc "/path/to/config_vcf.json" -st "/path/to/sampleTree.json" -dt "/path/to/decisionTree.json" -t "/path/to/template.html"
-i "/path/to/vcf/samples_1.vcf" -f -pb SAMPLE0 -pd "/path/to/sample1.ped" -m "/path/to/field_metadata.json" -tc "/path/to/config_vcf.json" -st "/path/to/sampleTree.json" -dt "/path/to/decisionTree.json" -t "/path/to/template.html" -ph "HP:0000951"
-i "/path/to/vcf/samples_100.vcf" -f -m "/path/to/field_metadata.json" -tc "/path/to/config_vcf.json" -st "/path/to/sampleTree.json" -dt "/path/to/decisionTree.json" -t "/path/to/template.html"
-i "/path/to/vcf/no_vep.vcf" -f -pb Patient -pd "/path/to/family.ped" -m "/path/to/field_metadata.json" -tc "/path/to/config_vcf.json" -st "/path/to/sampleTree.json" -dt "/path/to/decisionTree.json" -t "/path/to/template.html" -ph "HP:0000951;HP:0003124"
-i "/path/to/vcf/str.vcf" -f -pb Patient -m "/path/to/field_metadata.json" -tc "/path/to/config_cram.json" -st "/path/to/sampleTree.json" -dt "/path/to/decisionTreeStr.json" -t "/path/to/template.html"

