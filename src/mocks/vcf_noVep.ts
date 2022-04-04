const vcf = `##fileformat=VCFv4.3
##fileDate=20200320
##contig=<ID=1,length=249250621,assembly=b37>
##contig=<ID=2,length=243199373,assembly=b37>
##contig=<ID=3,length=198022430,assembly=b37>
##contig=<ID=4,length=191154276,assembly=b37>
##contig=<ID=5,length=180915260,assembly=b37>
##contig=<ID=6,length=171115067,assembly=b37>
##contig=<ID=7,length=159138663,assembly=b37>
##contig=<ID=8,length=146364022,assembly=b37>
##contig=<ID=9,length=141213431,assembly=b37>
##contig=<ID=10,length=135534747,assembly=b37>
##contig=<ID=11,length=135006516,assembly=b37>
##contig=<ID=12,length=133851895,assembly=b37>
##contig=<ID=13,length=115169878,assembly=b37>
##contig=<ID=14,length=107349540,assembly=b37>
##contig=<ID=15,length=102531392,assembly=b37>
##contig=<ID=16,length=90354753,assembly=b37>
##contig=<ID=17,length=81195210,assembly=b37>
##contig=<ID=18,length=78077248,assembly=b37>
##contig=<ID=19,length=59128983,assembly=b37>
##contig=<ID=20,length=63025520,assembly=b37>
##contig=<ID=21,length=48129895,assembly=b37>
##contig=<ID=22,length=51304566,assembly=b37>
##contig=<ID=X,length=155270560,assembly=b37>
##contig=<ID=Y,length=59373566,assembly=b37>
##contig=<ID=MT,length=16569,assembly=b37>
##ALT=<ID=DEL,Description="Deletion">
##ALT=<ID=INS,Description="Insertion">
##INFO=<ID=SVLEN,Number=.,Type=Integer,Description="Difference in length between REF and ALT alleles">
##INFO=<ID=SVTYPE,Number=1,Type=String,Description="Type of structural variant">
##INFO=<ID=MATEID,Number=.,Type=String,Description="ID of mate breakend">
##INFO=<ID=BND_DEPTH,Number=1,Type=Integer,Description="Read depth at local translocation breakend">
##INFO=<ID=MATE_BND_DEPTH,Number=1,Type=Integer,Description="Read depth at remote translocation mate breakend">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=DP,Number=1,Type=String,Description="Depth">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tPatient\tFather\tMother\tSister\tNephew\tUnrelated
1\t10042538\t.\tC\tT\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
1\t152520788\tsymbolic1\tA\t<DEL>\t.\tPASS\tSVLEN=-49314;SVTYPE=DEL\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
2\t47635667\tsymbolic2\tG\t<INS>\t.\tPASS\tSVLEN=-49314;SVTYPE=INS\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
4\t106320294\t.\tG\tA\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
7\t42017311\tsingle_breakend_nation\tC\tC.\t.\tPASS\tSVTYPE=BND\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
7\t42064957\t.\tGACTC\tG\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
8\t61765143\tbreakend1\tG\t]11:134014225]G\t.\tPASS\tSVTYPE=BND;MATEID=breakend2;BND_DEPTH=26;MATE_BND_DEPTH=39\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
8\t145140500\t.\tCAG\tC\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
9\t107546633\t.\tAAAGAT\tA\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
10\t126091499\t.\tG\tC\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
11\t134014225\tbreakend2\tG\tG[8:61765143[\t.\tPASS\tSVTYPE=BND;MATEID=breakend1;BND_DEPTH=39;MATE_BND_DEPTH=26\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
13\t77570128\t.\tG\tA\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
14\t89336407\t.\tTG\tT\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
14\t105167860\t.\tT\tG\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
17\t29556064\t.\tAC\tA\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
17\t29663879\t.\tT\tG\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
19\t11216146\t.\tC\tG\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
19\t17451997\t.\tGA\tG\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
20\t62326992\t.\tC\tT\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
22\t50627593\t.\tC\tCTG\t.\t.\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
22\t50721546\t.\tC\tT\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
X\t48933021\tx_chrom\tA\tT\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
Y\t2655641\ty_chrom\tG\tA\t.\tPASS\t.\tGT:DP\t1:50\t0:10\t.\t.\t1:50\t1:50
MT\t15326\tmt_chrom\tA\tG\t.\tPASS\t.\tGT:DP\t1|0:50\t0|0:10\t0|0:50\t0|0:50\t0|0:50\t0|0:50
`;
export default vcf;
