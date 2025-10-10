UPDATE appMetadata
SET value = '{"uri":"placeholder.vccf","htsFormat":"VCF","genomeAssembly":"Unknown"}'
WHERE id = 'htsFile';

UPDATE appMetadata
SET value = '-i placeholder.vcf -f -pb placeholder -pd placeholder.ped -m placeholder.json -tc placeholder.json -st placeholder.json -dt decisionTree.json -t placeholder.html -ph HP:placeholder'
WHERE id = 'appArguments';