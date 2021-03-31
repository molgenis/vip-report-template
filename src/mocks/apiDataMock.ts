import { ApiData } from '@molgenis/vip-report-api';

export const apiData: ApiData.Container = {
  metadata: {
    app: {
      name: 'vcf-report',
      version: '0.0.8',
      args: '-i patient_mother_father.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f'
    },
    htsFile: {
      uri: 'patient_mother_father.vcf',
      htsFormat: 'VCF',
      genomeAssembly: 'GRCh37'
    }
  },
  data: {
    samples: {
      items: [
        {
          person: {
            familyId: 'MISSING_0',
            individualId: 'Patient',
            paternalId: 'Father',
            maternalId: 'Mother',
            sex: 'UNKNOWN_SEX',
            affectedStatus: 'AFFECTED'
          },
          index: 0,
          proband: true
        },
        {
          person: {
            familyId: 'MISSING_1',
            individualId: 'Mother',
            paternalId: '0',
            maternalId: '0',
            sex: 'FEMALE',
            affectedStatus: 'UNAFFECTED'
          },
          index: 1,
          proband: false
        },
        {
          person: {
            familyId: 'MISSING_2',
            individualId: 'Father',
            paternalId: '0',
            maternalId: '0',
            sex: 'MALE',
            affectedStatus: 'MISSING'
          },
          index: 2,
          proband: false
        }
      ],
      total: 3
    },
    phenotypes: {
      items: [
        {
          phenotypicFeaturesList: [
            {
              type: {
                id: 'HP:0000518',
                label: 'HP:0000518'
              }
            }
          ],
          subject: {
            id: 'Patient'
          }
        },
        {
          phenotypicFeaturesList: [
            {
              type: {
                id: 'HP:0000518',
                label: 'HP:0000518'
              }
            }
          ],
          subject: {
            id: 'Mother'
          }
        },
        {
          phenotypicFeaturesList: [
            {
              type: {
                id: 'HP:0000518',
                label: 'HP:0000518'
              }
            }
          ],
          subject: {
            id: 'Father'
          }
        }
      ],
      total: 3
    }
  },
  base85: {
    vcfGz:
      'ABzYG-0^Q<0t0YibZKR7bYE?6bZBLAUuI!+Xk~IPc4KA$>|N_~+DNwl?ENb!PnBzD$ANx7oXb=Zj4^jGW`JZf_X~xwOsK)Y0M1UP`j5Y-TLOd-0{IEqu@ehPM^c~PIelK;Eq?gnu0QbZMw9!_EdQx^@s(xCKYnlr&pR_OPY^+f5(LLSmFoH9ubLfaX8n6Fe{4^^L+l+E8N|<+I-}$`)9rM>z`0y!Jf7xmJF`x%G@N?(H-j8pp3^M%WpqDkPdnqjH=MTby-Clzg~RP~qxgl&<BaE1zq@-Fc6;71uUXb(ns&Q#ajHMEM{lX5gx<`L+C#jH)U8Gf!mpi4zccHP++C0mHyDu&MhL-;NB7<|e?0!unR@g%Q@n0oRf_pzh2is{Km630SpKj?;y6=k*4+-n7y<2N`Re>#{o{wKy#Nji0HiZ@PyCiY_W8(;F;L##G;44v=IA&BkL-?a0hw~CR=hqhWw3S!y_<*r;MUy;1DJ3OnpQZ6t0W>s9cRX)!ME`jK;oEW;rBQ*@$RPHANga1+i(%L2YSIxa2B34?cdGv$M!FG7l7m%qlcL{wKC0ne|GN21F!wn8@Io9?>fWbC_AyIv$N?}Aid}hX5M5Y>76^B{dPY9+Dh%>I{!bF^L(*dseLLm+RaM2R=KDY3$<eDwDxd+<4y9})7H1Kmv7D{{bBF)+?#eM{jn3uu|>My?F^vFy<z_jJ`THH26Qnq`_iAn(P3}kWt<d;v&=v5CZqdINU;Jz<+`v1qPA02LRc0Wo9+Ge<MGccZEVh4g#8v>3`U(<q(OyxrC7>LyQ7I0Jg+|-Kg@Cg`?)UYZP(lMfM0jvc?8P&$Af1%wYQu(1)XNx!-B4ofv%FxT(~}YmMIJd-oP`V3r*#!UMRLq^S7%H*Hu#nEixBgXZA4h+B10Ye8+sKT(^F!mrUvNb<I?2tp;o^%b%KE_jhc%=e0t6Jeu}x8%*)Mx!kEwMl-KJTplRg_lKi)r`x}sLR)U3HKz1ue>wvW+l!87&MVE9mA+}V8im@qxu_P(&7h&}=Jm%0oVqO6itWm|X_PLSrC-}ug;w#>EY5vuwy!VXM9cU+p<TFGerkmGu2%M%{~OvX6`G;Fi%KoDSGy>M_O4r(p}nSmoz-Wn%+M-mU8QL1m!;bEs<=O170d0bPt}N4?X2f#nd*nkKL`Eay}`H4jW>i-Kb~ejeQaj_`7r!_IQq|Ug&fXR>kImEXZB?T)}!D3F;-8%{@xq3AMU%owr`}#JEGbc42Ehm60g3WekoVm#r<T*wQc-xGw65QUE2?a(}!vM*6V@+)Cug=8WDCX!<pCfCae7TB$?4&X8JH5k0w^7GlR~}^tsw{QK_~{jdr#0p;T?|U?Z}zmp86Iwo2)*E*H+Pceu(Kk><Dio6*2DI>X=1|23@@T)kJNc3EmvTnB$NH{pAvW9j0$0lm@P<h;I%V9&kr>`V00a%%?_2Q)_3lDdmQ%CmmYU5rl$-mo|Ok|#_Pjs(G{3)g=`WrUinoLpW?vDOg1M5t*jHP*`dG>RhBY)ODIXGDsmmhc6&LK<@-P!hFRP)iIqM?xl1FPq9Wrb-B!M6DLoOi;mqw<K!4q{akOKrV?IqXjwToHEH08;)^^93jDRB8HeO$*JO4X`V<<7vvc3td&%W<V%4fNtxy>QABttQA9Y!R43wy7b4Y&awd7AjPOFF3S-R)PHxIVq*5U%2}|a4AyUv5qO?kE30X)~P~el3#FmhSK$*fsZxIk#$dhA=7#E4s{~X^tp-B>P5$&D7Et!OlzU9_et;OvG7dlE>ylh-w9o4U!N0sv<h?$NG)z;Ck9}CqZ-!U9n(|Y7vxT89RVcu|dbTyiN@g_$X9lQAlK7y==fu5+N>{0Qk1%K;>X7ecU`T1)7ec&(i<b7N)pRX@G^!s8nkFqw<MvT5+ac%iR<FsC_pB4weg7fs&nx56)hdo%n7ueRbR^wyo)P+&?v#Uz8S*ex%-D+eXqKMT4AF3bDE(+CV>2%&$cx-TF4A1s&eQV7>LH^EVwGa?owSo_Y^ZAE{PxHAN9Ed!`VPhK++J)zZ+P`@E%DG=krTTm8fAghUvyAKymQ-M7YFD*F3mc}WqUIgWf|-54?p*Vg3w#D4=4fJX`+m)H=KDjCZhvM2s=}?GxdrVApP6hr^U)8?Hl6-F*m%p^$W3PxNY^_ya9Rio+8sgxlB0af-1nz8Uh>*OPG_zl6K)h*r8yu`oLZC4(09xBRLh;BU}F$B;~+tStQsC`c#fMWO%|VZvjXel&n<hZ?w=BZVFahf*}|kpkZeuHMha?x(7>)~<o<1ny<V=>>zT<EGoppUQlAvBFp-iAW3X{KjKNY#2~YL2He+ZO`mgs68iy9YB1@!yDC-{1Bph7EyKu7;h(pXR$YDC0c%A#UEeeDIf<9PkqydN_2ry(6pv6xtPZI9+0&G2u6Paq%F@6V5qpY)J$r@pp5)scDrkE+?D^Y(qn~dDU5?K=hTh@w$5j5eZGxcuUU%g((HOV{=n^C<!sa>77XN&efN!^(sLJ2eUQw^_u@7+SK4NO4F(fI~?FHDp;R__@FH^<iWp1iHz`!al*x@#dhUQ>6R!%-TC3q&+OffgYPPJ-3|v)$Widphe(X6@R=vopTc6bc4`f0*IgRU2?1T1u(1IM)8Hk}Q>=R(Ho0lSoE2K&o^aPy&g0f4OuqfTQ8vHN8Jx#r!3KqSry$$>zNXLyr?LA<%#<-6-4O{HkD~XAqVpPxEK{CDqSXs*t5prcz54vMusr9Dx-MS`jwy-k%93Y@NAAn=mFd0nR{8y6r}-;G6N#nX_S5V&QBQY!l7Y3vl}WsN6a`uODH9&Nw=P%g*q8W0MI%B?M6f(und=Avu|_$%0f`L^6fAG~skSc$i-Ghvbd(1^>9)!$I~i9S{0luWcK64~j^3$|?L0uaQ(JrjatmYO(gq2SXLn+Pp(qCghtZ6|TuaQhIs+*IWvt`|;>uc$+4BD40M9x1-@`vgmG?mGb4B^C%$k*#l(b>%lS2VG<>BhL#EZ6E6Q;SeP6F?glZA$VsuOp>GQN0TYasCd&|sAQBD~M3!UM>EHvEt3A?oLx{|j+cO58SX1+i+)BM38=)LHhX_@c0lQ#d_LN<CqFVF(2q~Ur8~6)RJc_fBUG@2!o7Goi4`abK<B%N1>gy`aqm=bcc?{e<<C4-CH}6YvmFVyU8EQX^VUp!AjnDv(6w9~baqjz(!Pe>95CG#~V|~9ZP7};sA+emkkXUsie(iCjo~V^pJA?=aP)U3}uWv_Zlxdz{g3=+vAlgF*=kEg`*Svi>A%k)pM`76D{g__!eln*_l*Z4gI4%EN3|9)7VD{8F3po|Rs_9LPLd*c6fnD?OT+__Tz1*zWGsP<e3723e!3S#0yG6YOLDU{{kD(uHRLZH+ik-P<k|XB0?|M^P^;+KAkQ_BpN<ZmP76K!cYu%HW+M4~P;e;a*&&lFvy{$}B@#aEM9BC5Ybetn5O6i0E*5641woezsOR>c<k7rBfq=`~Gwz%@yg6&>umxf%LrPeM?I8D*sE#^#6jn=|H3awj@{ha*@onKlmSLTD{54&p6qit5Wp5U`Jk0n;Qim4JTHp@ssFRBFD_%LBUkt$zL88M)>h~crLkM8p`JMsTYw_SJ(x6Pshd<(a23!+#SzfGYFAOlCC3)q5a(G+{#T&vf0ku?Z`GhvHrNQ0{(uDXU1V`vwHG>EF_Nu-$O(uO_q@XW6&vPEX`8vMU<FtCL!hz!V{i}rDG19h^6?W+oRpF#{D0oWd@dhZgAY+(x%unNz`+RFwmY&kx;2wa}WYVQ!m>;OO{##!0;F%DQG&9+XfqPtD2(n{*T%OL-KWssyvQ=2P}PmHJx12Y;IQ87YStB+JGOo&4Kq}W7)Ag$~NE~JejHX0h}%~(f9A4yiIWf5}S-o&$e67OLi2L=;%w&w;5%W^DA88{aHc91-ycM(Ehy4AZRF-JAUhbQx-ppinT9HI2XDTdxo=BpE<wt(@x(G_$85gT1mE`Q?u`!x(np%=^XD5b-MQM6ySGQ@O>*v$EY)z~b(7uXzfJ%YWM>XMpo=8+dXWozVx=aCirdw}U>BCG6cM^ipC!_M8E*PVH{_0D7^%-U(f`4eL&wy7G$FtL3mwi-1ZW2y?%q2YFP0uuwf<~&z3<<2Zu=*)~wVW=YF#I8r@;HecfYL_B2I>C>aq4q2x6I+>h9}bx$bJl|grKV?K?v(?f*cMZb^*)FsA)=uW#KuQ7L_3kd_PIo|uW<^aOV_ox-6|pAV5{@`Ljec&WeD5nV($4$JZ!zh6BxuuiRTHXaF^k!fVX7~fzLRLuijwEcbUh!TlEJ2UA_5x5=(f>>TEP__d5Ndcl#_Qn~h-yWi(+B3}fE%CWdLimr*-K-ZXOmGR0me*Xng3w3i(FQze6;U@j9(h{{450D-#*1@ky7HQp4=zt|ALqrwuz{UHKqtDo1rIP<Swzlq_9Dvl08q>l+}i11f)!S=O8`szboY}1ezrPv?zqxi6ye@rk$xi5Lxz83TGCjDtKQeeH;hQS_fw>QT~sacL00VDGb#83=zP(>k=XZg^rvwW7ZRBqFRABNXf5uHB%jRR|QexCjcfQ>;8wXv+J*IU?diin++n3WJKekV)*Q^Y?GgD5cZ@eh&fD_2A${;@P}bqA*^68~T&?7|PfA1P$}5$6Q(R|a+?{RmU3?3+9g^dpGk1<@|=&`8@CG}ta>7Xy34+r?5~O$iTK5;v8eFsbH~>XBTXX3wE>2Imx^tKAHp1o=w5f!P@|Mk$jqt4Fno()gt+j#n|$ObNP(89BC?X)Fv78rV&Z**+tsA$E=;MOWR7qw&{_Q?a_1-o6oYv67kz3lz|}|4ckew^kRL?<HnT2hnyIGqQ@Aqj5eBGZN7*LNuLwHl`eAcD*hmhN->Nt*tTp&bV<RI7@sTM<TQGP^=HIKrv3vSbZ9&AB05u6cs}Axqe93rwHW+=!_JHVXrs6_aiNkT0<<h`HdeKnJBe0Q&EG?z)EpCH&cN@XI$;AL8tBUq<`<VKeie>yh<f)KZJ%MmH=zmP5Q(R)qe#uW;x|Mb=bG_e4NvmC9)KwY<y4<I=|E&mxMrSf+Kn(fVD^KO(-AnL7Ar`Z-WU2rz23za!lvVR!Nqw%zujt_;@76!uLBrMj>&1tRLGSXo6L!5>iST_ktNP<f|l0rTJW+9~UfYZ-o3F^d`i)+76D|01iJWaJEc-Wn4nbc6bd4OOgEtxxQQ<NjZ>QUkQPzxvZa8L8^#aoVgOGArD2Q!shB@>$git7&PPyC@Yxy{)+)yLuv<F6v^1)0A&jEgpismDHTzEU5r!s0UIs&@_iMGFcNajEQ=J2RK@Hs<SX12#<orsk255`jH8l|Wr#D|ts@NS91bT}K2cV<1%Hup2NQ4>PWiLvi7R(Vp$!m11RX7R#K5zRS|ne2m&e;f!<klFp|M24T1Xy&MheB33k!71t%$?`4I~#>A2Kx3PQu#;jU#dqo}?&RB*PLdR?0Evpb^Xfp@H4Qh6dd5c4&Yo%dOTZwGIt|Q$94*btpv{gu&3EC^~d#)@on&Wh*j@jUWE5^(c$YA_AWGD2RQ(iynpXE@~6xOc0-~L8Hi`M^QFc8z2O=IrJX2?sMay;r_B*E!UxuOK7NHU8V*I0UCP1&@lS~%9zU6%80F_as3H0fz>h%Mno*iG}<Kw6zn?C0YJOq5-oS_8$y(09;ZCWM2UQp6EVjO)Q2yUr@$OTj*!kA?>k5gj40mH!+fF*Ac2OdC`c542R@5ICWW`f$3BsRM$*X3kC6(yEGC`t0gVJgh;-yZLnAb1TcNQ;vGFlOl4}%+k0rzcd*aO>Qxi^sp1@3RuC=R(g>uw>RTwgN|3wM}ZB9C07MiUIbs8K9RnknnnNz~x-RfIXYKG9uGMHwfQA%Fb8m}}mW6%->>j3>1@xu14B)#Q5`e}FvzHmx83;b%<FL4Ad4V#j2y|G*4l|f0L*ss{Gy)$3gH&6#PTj@{6vj4E$J>*y&+CM}aDK$eI!Hh<6j@q}8T)GGal0*GgJty^7Go-*pBEmO+GlN{6cjJg1EIcwZf>EZGAKca_Bdl=MdvI?s0YU@2rk<;sZn2l^wt9!|W+dQ1Q=1=p&>@Dj6C{(mk1$bczxy!ZcOOul?;*sHLMok7_LR_r3^AmVTCDLJS(M<2T!<ljlVAk<J|wLr6DcK)i98$z6~;8JDibOX+Keg8CEnSLIqHZR6Y}umXGM@^X^j{^B-N(2C#D)&)sntedF^>QwdOXZm6H5mG}TTy+1OvVu!$vlz4YZ-h02*q-9M3dS)p$Fma{Z`DO<^1{~8DprST_UEBO<IPT}u3JLrHy6PDWQS`U4|{+1KS15iSCDNU3(C`=;1TqP)bE73opoXv?sTPyuOkzdY^3^OuHF<q9k{b5G?{eXKi%=mOu0L)WLl1+h66U?*MZ*B^n&8czwt<EG}bb<wWJy-S|;?-KQZQ`{w{@mm}u=LNsG{t!RJADnwktj{@9iIFrto_-w<~yt`Li4dy8*M+0tN?M;{?r1+qKj%6Mf1|4=C-m3H15CVyA>7>E(YY3F`l-_h=o9J;uIMNL98uMunDxypW_|jD$UXh`YRL=!-6gcyB|B#CN#a=hhsjy{Eg5cJD@>=32Q2X#`0Tl{i(73H)5oj8oO_3&>hgA;puxJG*oo%Uh3Jf`-TSF0S&eR4IM$l4(J~&8um+`2~S32PP3dR6Rd0^SZVp>Niutc2GJC2l#IrlW;vU4{%zTS$Wk}_shoB-e7dQe`-TSI0gaXEWlJ;&iq0(qFPm;|*}kDcc0j}TDOBnR8p{QeMEWzJwE-$Oka3u3#Mq5sTKFna)QmbfSk$S=12&_MQ?Y|`hz-iYBg!GEI#lJr1b)_EW3+@KAXqLiu{cn-APKK5EwO9e(k(4{SrB$xkfs>8%P1(2eQ=Q_k6VHk{;pPkA=+EWcD`H{DYel>uF@=B<a|jh(xK2gSnZ(5A-c#Ar+5c6R$OEVjrHl*2k9b1oRS^TARExo5j2$j8sdXS<Nw*avfVgxWc#f7kL!nqtBU*512j-A&y*Xmdvx8^%RC9XvMd{rB}0-2@PHqGgJiBu=E9Oxm6=w%rP`wGjFV(Af;>EolwE3txe076%S+-q8mvg4u;1e$h&Faf9S_~)F*-EZfVRP^BV+}QFnyBnuS{@+ta!=?put<vAORY7s%F|~h?q(OCMK|P`=MljM!6Zv&0Sdqc`!111XEWvN$ECC1d1LmDcvfA2tEhW2)hd-99n1k;W`WhWu~818AhPWKp7?iptil05i7t)rJ}8(3}UGX%VbIUQgc-~K!z`=&JK^sWK3ixdm?sPyxC=yCRwzBp)Sz|%(k~*{8BZ8^cmaq`A-OTmk{hOqv*A+SBxLIL`?@OJ2f4sLk{i*7y@#1#>k~gK48)%`9PILPT9H~hGwgrHfQA06d@$)QiLF`w<`EH7#esvbL5f)BdF{YjBwpmK@Iplbk`(3386@ro&-@vqf^jb$;`WJlH7#UU2+ppRaxYqS^+~qPR<v(R5c1tJJcu?x42OSA&yg{_#oJNh~T3KFjcG~7%2j=3O`avyT+a{QcNAgR4t1JhBYmV3`5Idnfqv)EOkL}r_=?u$Y~g8!O+0VIU|>-gb}1Ep%R8mQ-s#zPE$s!k0C{{d37X!?Nv1+GUcJjLEIjRmIm>A0pW36tzwS~8%>X;9!1c7Ol^c61vn_~65w!S8GsA_V>~#G>Lf2uIW+Gq%aNUzrivrOMw$hTL9BzYHnEQF$6GA<+lza{1vg;mc86|PZ_U~9<?3vEInOb#SHh#|vt1>eVQ#d$ut#=moltDPxlym&M<h2wd``JhstAY=H3lAM+$#E{L7F~eq$lrouV6^iZG!b2gXZosB3aOsg_zjvN{3!?k=P14pMK})ksN7yZFi*{c9L|jLL`xx*dZx1k+wcmo+RQtR_frz-CjjYBBO(cVDD}pM#>~Rvwgm4QLn&Bq!$o8!~9@p*%RW~=SE;L?n#ZE1OZZ2QKartMe(cQZg0YvSHlmZl`_g$vp)ruNT5;Z;G^wfbX7*#6b_`eLg@&x7^Mb_5N#SP+mE+O+X-W^aX(5AnlGM9qT8>`5{W*xHX7r&{W!uc)t$qEaLbOIwbsoqBLyo#*M*^0U6+hKuS6PqerjMP$i7h7F8i_@VSZ|0C8)wQz|tXDh|CtORM8lM+eKq`qnk|#tVB(jjL{v{l*#DaTBXssrv_Gn<cvhEk~0|vl=3tR=+wYUP^1yKU6BU+Ef&~-m76J=C0HqfHPr|o3fA}yDSW;WK2^`A(X@Ebw5&+lJeyXE+zlpixf{Q&PD4OX+E#ZEjGj~kr+vq7y9Umf8pKW-IoXgO)yT<)e8FZo<nJb-BT=h_PQL47jzj)#3Ofz3bO@G`^9CzHfX8oaiwf}gZEXT$16BqP+}AcauoCon1a8;o@gu&JGaT`ElkaJOMFOzwgx##cN>KOVx=r0jxd~3rg#ja@MmxV5(flF#!{6``<^m%wC20};`MD7Np>ffl<D2UbSD((UP>Y=szqtKkXUMIH&)w<GhsuS0y8qUc{#m~ouh5VCXh)qN|0<*9UVQj)O0u`^z5rMkr?(fEpUQQx>R;W|1!{BV{Ok+-RfY30<sgA9jrq;nU)Ru^wK8;xVxmCHfkHqIiB}iD-u&k#yM|wHu1}yb+f^&LlnlBLA1==CFW#S=-CkVZ|B<;EO84A-yS};p_W9=PUD1Qz{OeDDt)T<aJ@%H9uETyTRv4Sm$Ww6;mYbi}<<b_>gd*lQ*<YPes{e<+0+fU>*3`foW^FFdH>=C@HFRh!6_YO4&zEzAprW#z<9ejf(9<(vE_kho=Gjw(87-buJ8$+CAiK4TNvC(8F0Y;T6}<D}|Ddy6UcbmXwtofx=*vfdOkj#s1hVR4pf_5w7-W=lKn*_ojv#~UY0x`m(8`>VpI(+MKui*qrEXVege!}fk^(Xk1_Os08(t}!3DQ7p?z1E-8iHsQldhLUVGAPE*7+8%xwNEMydoh8+G&DBIv+G8(uh}>&AIc@rs`1>GB9e3R{$Ap#4Dob4Oy%dpdn;9J}NrMm?ztnklEu#W(yhQ0i5=Yiq6QZl7%5&3M`5|A`9_0ypJ@*KNK&<l%0EM;zdnp<msF~nwNNKNXca0!U&NLFJi@&u_KC%46h#c;&9x!)?SJ1`~phX_mu&*I_q3`Od-r2%<0~V_2F*AbqYS*ZOkd3h2IikKi&`Yn^n|Arxz3?<xOcv83YAq<X4{vss#l`u*#Q!At*59@??hGS{=OnF7jlig*|E`+GJ>50?k>vjkgRDmn^eFs%F0MC`p=I&2W87vNQ5!1k=8ZDE3^A0GY=NFdPwkHhV&V;dCZ`Tb<zqzcrhO-%O~kou;M7h+tDEUcU%;n@%>3;&7R&Q=+Ikq~hu4jT|Z7tb*hBU6>f(e#(s=^DZf-7z&b$S#)>I6=8$gIhP~N92xwr5k41OZ;amTOUSxSSwCicF2*RLMV^>YJXTiTJVyD-+lV0|10W*9AQEbB5Gf)^q!szO`MOOxYm-3)zHl1M%4??jr);JNQJfh-O<+@*3#?$oa*T?JK#c}W1Wpen5e-Mg1U7M$c!<)l6|pIy#JMEPmPyizL5L6Mg3cWrED`*Pg5%pyZcqnDQd*hum^C;m3Jx|^g9tcea^NISdo&PxcWSlvm>t(Xf4VzAeFsKaxGq2X@p@@jWZdM2TbhZ?Zp;A%UPU1r*UOIp1&z1^0UpPMK|#4%p&vPM50-MZs#30?h;5-<{qg&61?P(W-Eo56{^8$#I04I_!X_z?QL$dyf1{s{RUs?AslBo^C{LP7B~P^;eKwH5G{sZRa^6<#T(fp^;{*9ox}6`zMJqpQbM=iAy1u<M*q+~FO%1$ZHmi4Lb9uR1JIW(LP_j~uq~$znrkQ;4`j>ycI<=Qv`3KrcRk>80R9KD-+1rh&t}r3}CzO-ynRflOrFTNpJq7pw^XdJ?`;Zm+0=;}3l%td?-A<_rQLa#`o>5L?VcFesEi^1lNh=QvU}lUsm>B_>!PLMTQ-^t<%q`l++yV#vnu~ps4awhagN+5>HnLYUEEHs~N?4GBJ%@!pewc3Ohec7QVepmq=;CLTyD4Ruv~$X$Fndl}2{R$!{4>lwG&J2xLu(FkB@eAK#M#kpE<@ZSpd2T!=~nU@CbX5kW>Lo2p-dz<*3`fo&xu4L`OQkVg_f?oSJ;>L_F(3T<`R47(G5h1NXBQ0(lFNDP?UtG^9p}anw~ABT6lU8*;<KuHvSRjM;W^;1f~Ywc#eOG)IQ!u?Zc2&d2A3BQ;mT8qyn-wDxl2DQaRnKbnnE$!7)<MnW8j=W;l4fMQolZ^^g*W;$xHNG|J-sVcQ>tad4}`vr13mR7bX|3B@}bH_OWy4{{TxrOa~^%(Tr-z{vf;%bhcmUP|SpyYOI&<v_r&7GjpMu9uNH6d<XlQ&yyLICY%EnNOoM7>bWRhtj&{KP_O%0AR^LU@2D5z_#*5vsJ_fVKkp#Z7@cw>xWQFKYVg^7RbibOi2sRH1oZ|Gp#NTF!TtE1G7Lju6!D$rZ$1)0kDt6ESNa3aW<=tv01B-7HrmMJckfqb&LR8;#ncUKI1urGpl2q*#J*6dpw_pW1EjvHIl7eqV_w8?OJv6yx|-{t5I_E)TzeF#f<w^JNsn1pp~+TD3?tv9!d_c*1fWcB+lCX*^z};Z>rScXL-bDdBmrcN9>~iD%M8--G02~#O;y8ic(`uVK`A{YtGI$t24I+Lm|qA!adRo(DkdFdtuL6K?X`$#)@vdZ~enAvaVunWZn5-l1!~-xQ$v1pfKk4n_|WQ6flL-SneH^ad2T7&Q@<(ajNTNT0|0eRk1eiYNeOhWA&!oOA?u;F-&L}Iiwa7$0Usx8Uw}iLQ7BxA$-E1B(pffXj-y3E78;j(t}0Qrx6V7;#@M-#<{eZVBvRzYGSOZvEg+VBg}3jN$T~#;Bk+G%-(s8g;PWdG7ZOuQ4uSSL68`6FHWZpD%nOIwB4BaP2CJhV@(abF_Uh*8`qE1jOz#E$NoC<DCl`A%aqk#6Xm@#>dLMz6q<@-Lr8Fy7)J0!9P8n&l`h#7V+S$4hk3d`s#)nMXCoedQmJ8rv{A!g?7^Jbu?LLY54>z0d4{R!jiy--=5iH2V%?)VJR;wE=vSpr3LPqydL+7(uYek?p5*eUTLR@kFbpR*^}|4|TKLppNTwn&9Hk;vW(c5n445GpAr48zA;qG^q3Y}r<YE1@M<c``h33<Mfd?=QT$30T3@N0X3IGKuXUg8EQD_S9D-@c^dq0@)Qum&W&-=YHR0z))Dul;M=SlcEgj6C)ww5NzUj3|Uxk)eL#`A~2ks~Grl~7w8EswTGn=UCgGC<1h_b5}vi?&fMSU?bYM7g$%n(!`rva?_t(olgB^Y*vbwz81gkR_-3;F4|ba!=0gKV4kkzyAE+oHKIs`OD4M>-SA<wv6r4P-fe79Xo4%4uOajGK5mhL>TO-JFYh{a%nJCbo<k$!pz7&`m%g;@f9)yOY{>+7-}myh<a~U@67r3e09D#hkhcdJ+IsfKo=#Eq&8X<B@tU9L7^jvypO;iwbWb|@5L!pHVixpA`A)0U3(DmM*a-r01>Jf*8Vi{5)r%UYr2SVrkHL{cQ6y$_>@rb8Xyc~rbrHmaJv<p5{%+TkS;jFsjaaA!x@Eiw+Rfc&Z~Q)I5G?pX1NP8`^N(cUeQRC5#hL5LHoW^F(`Y9%aRdcB<LU95-11skLr=t&iQ<3-M{aca77euR!aW<*KNw1pU)p~g3(TQejE^Fr;`gtDQQALtH-@(Hf1BoPB4e}RU=MvKB0C{agatq;3lw%fuPZdK!{L{b^cJKn4H=a^LPzuX2>-@>Ejxo6y)Yi|5xiUl{|TK^78oV?C#E8mlY5G@npQz<J4@mP8hB@&>$0kr+Mwde7HUPd~x^j(}(+_BfkD+^ZF^XT6GG+=>5f2G_&1YU1N&=IJ^3Ax4pO}Mqs=UQ0&3i7VtF#ADaJN{bi2Vmn*xO1^Ng_R%D}Xq%QueQT<;&g6HYkYt!>e1{-?LI9f1{N9lQDma5Sy*0|<)B~t~*1uOlgL@y}#3g245w~Sz|ZucauPX|D9HX1{q%t&`f;1T_PaMoG0?t11Kwrh^*f@3zUUAK<AkLY7^c3IxcMuz!-JNd+}?wCauH?@&THsY0lcqQ;C?(2@(V#HaE_U>%$7>RJ|ksV=3I0+(}wQNBv(?U8dEtDAH<`%SxW`?`$O4}td#8gQs&B@8yMl{W&S>PonaxSM-v}KH48=D;%Awuy@YFOyT@Tr1r70zhM-8pyk_@`|pYl0x8>_=agC$~3*C@AQRgfRsS4ZJibt2gHS_;Pi=wVe^$)iSOLM7TvhWD=zm4e22SlC^v@DWlnYg!np+!DZ-jBPwMg-;xT~0-x6d)+6DhBogtH?gAr+6W5}S6NDv!m&)S=iKfL#U}U)6fTHy%aH6MQZa;m#IQ@P5E{E#HuWw&f*OnT~O2ZL^OoO9VVw4CrXgKSo04RT8h+8ZHDwLlwG}&gv8D<UABdKxdyp3OKRXpfz@TuR|1+7RB+lcJsSvG+-m%hd&!#qaKVJ5V4d%Yx40ZdwJ;kJ6&pv0&PO7>t{2uSd9Hb5y`yz~VnXXFnlCAyB2(9oh>v2St0$OR?v3=9ptoC{8j5~gUgrcfrd@%59Gb(oaaT;?!gA}mZ`<bL4gC}2vV0t^O@!?-2!kbM;1(lG@f-*({|9;Y6zEu9&wW(SidwDIR8<9h#M1d=0PqS^k1q#yJ(^e<%KWoN_bq`OZ%7vM-kduh!Df{lsZ+9CV{W5hKs0VVt)8`l$cH*L?uigq`((k8TY-A(8m5i<GihT-GJz|ZSD44h52!+?d|jb=<l8>cz9-Hl0Vm^-wI_jb4a_OPdELYNA;f{>z*Yx};uk!w91A)i~L!{*k#n-mfdU<3`?fKhr1iRB)B_4njKE^@0U7H*v)D;nDPSyDz9mb~nGi;3Rm<{q1a2MhwGv}(){3m6KPtmDLaZ%|g?ZeAE%VR_Y5)ZSuP?OmBN%rL1D8xIYMT^ARkxiH|e+sfx<UTb-~N-IXfj8+fKXs3Wkgvsry?8@h5eVrphb3}Y)P0+B)dJ1^xW(!dzv)vn%(|b7}yvSX%i9JMzP3(;sl6<v+XdK!3qFgAc+myiMs}V#?5?~{=niV#Y-7wP4(ba9rNL#_COv3VDi$@l0J6Cq(5u^}UQjCw5N5`FfAM6)ym`08BykAXh;U-rT+#90@Bf%v$n>W8uqp6<L$>MEmHrtLK>2L_ai7OmIhvBg;d)$OpewY(Hkn@r7k#ZT)@wYq9>Gs>L!O{xGfvJHv%<<~q=6-X&x?e+gDYIinv5xT@jCr|Ds%Qp#3&k5mnn*=cQ{!<)enSq%em@Sz*_9pg;sI!k;uSr{^$Bfn>o?m7nkl%#lO!*Cnir8&Hkl<@sAXGws#sK7lIN8`;BK}d-PMLF@!h-8SbyKei)=(<S|S?X%UY5QGNXzw*|-HC2+uI6x})Sl-C;xAVQuc<&>a|=59$sd;tp?fhcxaEK5S!)q)1t(t{b@;T;aeSn!Cd^bMDx_ZtV=baR_&0{O;7<k!^Q}Jwe~;&(Z|bTw40g`gnWX-2T_h)U?LrIa7Pi)OP1%KQK?z?P(h1WT%*jIytqHt8K2nLX(Gr%2D5(x-VV8FDR_QWMRK*z+k}$Hvjl-^_SVKH{0|3)%pFv{9&>GEJ(E{L4<OEgDMM$JwAyq?5l)ysOKIgBttru3srAdJt2zRD7|p1_ycd$pje;iUU!zHTau)zlZ{NN>8Fy5>?q<f_{j$N$vXYSaX-0)j>n}KiJyFcpS;sg(sDnsZMS4B?N&tR>!SG<Quq{pvB1y#^q{X);EJC`aIxQ8*zXxISWrO@;-`$>&uAjnazEMr`e$d7rj7)bf@4N|InsH8Cb@pz8kd%yN$9A;9KU`gO?D~^n$5<zwYj^$`Eq*cW`BJ5agK)GM-vYMZN0f?2CZm~`sJ+L`Ulr45Chi)5#<$bZogm+rP{@<5lmR-uGQ0rcg&xwAE3CogyQDX9KS`9Nyf`9K~SU+5zkP%R)YsS2_0TEoit>{LK`13B$f*;{K38czvOF9$r2O%u(@9w*{sH2aF#Af%vEV}QJQ2|dSpHmu3p<~=+<d1u8we|_kM-cQT<!h8;gr$MAAoTy;c}3vdIgsL)gtc(I#6r8PHy<OGf@$BV&}4#EOQI=rv*~6>6>^XMv+)Q3)Bg0)RfoJ)gD~EC9{{!Q!zU$#Mk_qkJT9%6zFCRouyP2@csGZG=C&PyetU$sr!eHjh{{piA+19`$5Im_a^-I6`)HalJV@?oNsZ=?O?mpOdD<q)90)%s>A6*Kfzn5a^_KK^YVFvNX|Bab-3q>oqn4!Bf1Xh|frKpqF-+!4skuo$kT_5$O>0mWoiSHPlv2^HQW7E39<LG;^g%cAOv)s(6lJaAQl3W#t?~0hLj<&`+d6J*Ahsnc*#tZ$p7WIy%8$+Z*Ss{E<UU%2W8I>hpJy79hVFWqo_eG~HZ%bLAMe(?Jk(7Vt}3Sv@Gt;L89GHSeGnTW|aZ))KY?GRBw~BVq!>Pyb0~*2-<|!bAgNL<fj*s5PyDM~v1HqXIz*3%=SfFWjMlU~&+|dV9}s=paF7&7B6(&I6^pjwmjS-$RZ%_5Mo_wNle`(4KABp^jd?hm{n2{Ei8@?%pFPO79#AU^>oO&F<mOVKpi5BxWqZJB6myE~VgfScl`2@=GBI4+C~ER9YpHQ)-pk-j6f~;i8|`!K9_n6knlS?m39b8~IgFOz<iEB7W5qUM=ja1|HM7*%T2zFtbrMt()G!Pm!R>{T0(mHfM_Lk*Uoic&m%}-pJ3-Dt*c{a*Y|DFIb`BFv+G2rP{y&$JHv6@ry`4G;?)=ty65c3`x>+cC<IjHb$~jj<{>M@O%N!_uO#1>v3i0tHP;ust|5YTW3=i6^n4P!m(E@(a6n<#-=Ikx-qw9*}!Rv>cX)Dr?!vd=^KAGZ^aqMq%pg%!Pn*BnJN_clg(E>u0v@zyO`s)Q%`M&7}br!*_L8995Yqi^<b(+3AoqF=3N7)TAuQ*cTTG7BS?Tb6EF@REsxgg^=7>tLN=gOs^@w0w0U#E5z%J-^YPlAh>eN8i$crqK#AA;93l~&36)GXXF@qz@tVk$vvT2BNXAa#S1=O_Re|u_&y$ZAgmAR|c$;x~B&K=+)jc)#y9@hWcT(oUnwjly|6FbVGH2)O?eTVdf4@3Azpt@CNjhmVyX87^ZWM}~8<lxmu?YS2r$@m+;`iM)Jp^y0jYO#)R+s6L$yqTsi&!dUggcpeS~qgeas<wDRtva_dh(?AmsI?PGGYP0q_JOI*e}}C)R6U;9L!%f#9!9wFOK^w6xR!(1Ra&X5iTXuE2d3gWc?LNp8h|3*VZG~jiaCaNBl68?h;8|=V1Y-CpKo+ag0s_$vg!fuVDn6b%G?bKmh&tC8bkU=jiC%x-O^6X&Y(V)$D*DMNuS0k=6z%@ZugXK?^U-iBYoeBtLi~KPXe9!i|uvhS$!)n`;BCalF39mFr78yb#*!%YN1ke_?&*AH0ztj41tgh3s&=lRn@C@Jb26{ujv**R!$W$5?^DyW!MY5Gq=rH(JMnDAiM-|AFIREVRIGwLqe<mKLy&aKm3rlpnm2AC!k^_D0AK)Phl;5cqFs+4<EWq~g<K)L9Verv|-CCpTCbiX6Xr@sPHak2mTT1AOi;i0=AjO(KF)EcJ_Y@3pD7Unq#uQxqTEU1u7Xah`nY%KPxguNZ>VIEA1h6Y^dP@t;!Q^zLr+`@2`tgn<n*`?AJ8zxz6%Z0F~9-+cSEA;<o$X*rEv3L^GyBivdvyYYSbH{BXfyU$uZ7u0k0oDI-({{6+>q9o5;scGxjhp1n6*-p>COxd(g^CG&`zN6`k^qEM*0iYXrdfuH6ktlPzRwYG>{O5Yom^@AAi-27$H+lOx0a2zyTsBNkyn=_q3}8-y^3gWXP(bK)`m)_Nh>0dQ1C$0m?J08<R5SL1O(0kh6X+F2=>*IFT;Bv%C8LAJ%IFUcu&90<v<UVGK{NKlnl1k32mnQgoB=I|EQ?|5lAT2g01iA<!qKD?U6Q>*<hdYV4SI7_ZCF_t#DSwVLp_?hG=*XSso;a|=?0qX)r|zz4z=^@(p1IK+bZm;Ub#5j3~{&taoAEEVAPe1!&e_wVk~H?;&7!nkldAvBh1i_Fdz=!(+;?DaX2-t9Zn61BlK(s(Ups%a;<2Zj-o9R$p$&wkw#EzcgzM9X*d;PdMY3AN`;}PkJ%;zj)iUnMO$e!K{!~}3Ky?SF}5uqgRfc9Zp+L}v)?D%wva*EoRnsR!Zq%b7Su4+B{S3PRih;i+f@zp?0{X4Zj9$v;Tbzf3N)gb^RR!`@H1_nhMz6Jjkn6%_@6Jnrl?iWvfRe}nMa=`QIztjj>`=J`Xjw`C&7?u((5kLw$mA4_pQ`sgCoq>fBY7uN-XtbVl)5M=D*^rcON$|-btYh1t+Nv3cQD<Y9h3rsDm+tlT$;VkG;2^jaqAYP~E$2qKzwQQbGZZyU`Z+Z?BJrWJ%6*Hacm3VnaO@R+e1r?B9O6)u3_@0Z_+<cmyStwgQ^Ql{C|&{uR1tU!e)Sr)He<zrn&*Nu|x8<ULNJq^DV08KH+$h4hIik0EM021p!#1&T`u*344eMA=MQvKb<K*GGl;nBhN5ph|tmP`P|D?j;fD**`=XuC_;pJJDfd0kV{cAE~3RFwDn=U(2}g-slex$Fd~aY=?(iTNoEYWw(u{OgaETo+0u2n0e=4`PAcBC!uH8SXIVLi#}Cc_H_JpNfw=b?dsr+V0^CdoCT~xAe8!TT|Ez4-`~3{9Eq|o0zqy25<b>ZSq^bLfS_m28OQSW$BG|<MSQB|T~?W)j0cP_zx@6+MH1_kYBR{SdSED4DHHErzcG=+P4*gY!NX_NU2J$8Cd{QE>eaqZn|`;T&Lw-M$sL1S(T(3)>uB3a9YSuO?462C8TsE$_vGI<zrT<h-F<5&H_(}>XC9x|otB>Q%$iW@NBz>-xG;3L4jU*b^W#RRZ%8#G{K`hIK+*?e2+yLHV{;ddSqtRrAi6JuGG!Ak=q6my+X}ro3o@Z+eDL(&^Vn1yT~(~s_xCE5@{U&fT`%rNnJmY-gSyn|Y2@lHjh6Gj&3{=mm0L>M?3<G|BzqLw6q)7IrvPHSI}FJ9p`@Srz+R?S(o+24)tt#MfpI^bI!j-W7<te1aOdTk6+WwWmBSUd32#pbwc~_5^v62OE51(S@I;l`=mbmMXCowy5mE!4uRr|G@!~&z`p~@Ul8478@()D*IDWnPKEC_?)#hFISdl(0OCN{KN5{ute;9Lbx_6?=#f{z+=z{h(6*n?E_D@^rB>5xLp2TZi2b?8UyGW#166ML|p^FWJm+o}U%Asvz^V&tGkNoL6*o@X1CTG_(P1D;+6@9R*Mz@8gRa+<16GIiXS_zov(4l|b8DdG3^pQ7C(XI+OTH5L(DAz(Jn@s-WPuGFwl{I$Klq9O;NCYT0o0G<FDS;@aM0GbCq^d#wbQN%htlTS4SdvVY6BtFKF|CcVxwM19S=+{jft?I_sk06=qpi2~f`o!7A#+xDks0KzxJAbPRSO!^@_*8Uwzq7RF|eaJACo6sAOpGboINBwQ8$Ugrh7_|j^%}ie&S_w#;a=KL_w1iOkNeM2Emx^ss-IzG$xe`;u!SUn)T<zKOQe2A5xX>z39F3P#+a!V?nfcPI5^EI^#fX5f+{am@w#>bbR}SY1#9qX-HUqNUvi-v_An_kYEd`YyMMLrXl-(dPr2CPi103v^R|{NLaOtprmtW-7uaG5U`~Vl_AG_G+T=O5ynv135MVX4lf@D53iF0q2bN5rI-x__}3ap*i%)Nslxj`v!&R(@Qfs|uVHq(rEuQOu=9R$AT**|4aICAGDKu0By3!<9)7e4_JPM1$ZoS2AqR(3Lm|h>anQJGL2kc34@d}bZXnz2mLt-Gr)8H&_I#k$vs(T<>~xH%b6RT0+dfFz9#(*429K65(cS@QLBatCK*Gy2I{+<i?VtnDB@#2>N=US~1RY2m97^||C?jmo52^kF0AoQTg(ID=K!Ru&JwV3+;9xg0ak}I^KOkQ#OAfIh+50msJf`Z;uo*eXoterfi@#)@x6<qXVa|L?6`Xm>Cojq;qaw|R?LXeUM7ANs`mJs)em)I}UX9$nB+#WK>Pcl~N%ymN*lA{;h;E&1Ambl8Ps*Lu%BD-o*B}0E=*6!xaRa0^Tr?D4Z|>v!hmV{0uRgZJZE~I0l5I0^98>}8s5<%9M3h_fS5UDdq1&j?snt<=w#$7~-MOJcQwQaNU7-S$w<iQ;wZ{JKB`5+1m6xko>$)_1961J+4sl-3*SEH{&QNM+&*P9t)2UE}k^Sl|K^KFAKo<glqz!mKFi0BJ`hJIhDI02DudK@d_GtI2HqJAzL6;_#Zs~{CV+*gEL7t4nn}o#K$V8EM;2KCw6$!?IriuhF3W=SuCQbI;*#gO4yMiDAh5%^}(<(^Z3?yy<i7t`oHIeukNE$aeZ}%1w)7|ml)nPk++(CBFFc@Q5fYP?}Zq|Iz5T45X78YCt>)0!P^HQugnLkOrg}^OEP{01Q;CjuL5H`lek}AK6(Nxr1XwM;WI_f#J^nlxmyMg^KxxCSY(F4Q>2{G^9Z{EFcd0tK~<93c0%#4-iqw_Lrrh?ALk}7$VeRM`@Mv^;uap<(+(7v~JK;1s8nJW7?93OVk`4Ci2tus39{2m?Cs{BPeSEB1*m5w8wcw;adu(ck-^sIp>@xcr>PsF7Q(!lvtTrQ~voy~F}MAdt{VK&&FU6!eG<1m${8l<At&L#7>B0T2Kd_D*hKn=<r!UjVu$<x003wTN;1d;K%9iXLJ-rvtd*cNSb<APkN4B;xRStf7XXX+NTXp36q{uN@)v~5{4Lppzv=6eV3_c6<+oux{XC+lu$;23IAv`lo<=E>~g%s0+0=Pd(ie7A#ffYPV~R-(<kN?oE74Tqd27<VCnw!KeXsNJOtpjMmQOw<Cj?TzY{R&_wB3}+=kx(>+4f~XD%E)S5IvqEMF5MCZ2I|q;*0z{_*G#$}dOWuXKHy+mEQw9A~KsV>M<FJrU4~KM?0J=H!eMrZf2l>2`Y>2f%N1=`K$v`H3#C1Imwpu`^aWJ5><a8I?KA=n3Fy#@gW8nyGlusUm?O4GBFG?7m&J%;N=jBHx^THAMIehKw;Vun_yM|OK?uK^ZF0VZ}r)2GgEPs(tdTYNZJUgD;9T<l*g2=o83z<A=80LZ@JJR96#F97%Va6C)t>{`Y<w9JOU4;(}i1)uZdUW#?|CF+x2n|cS*a{8*!bfM?9MPJl^UIp@HtdkW)Rg5&-k;U@F;^_HQ*FYdF^N9lh^mr?aAvWwi#;+?F$RUlI5ZYy5_Bz-u=RVonS=!%&rrm0IEukMLbIiNd4#Q>)5{|)aB@xpXFQ7_aB5kEEu3B!p#w*)3a64o&;vPyt)}&I2pwh9=U2Az3_^c(%+TuKrLB&g1IG@*p;N#a&mDwkGVj`gw$E;#-A&~V#(TnSUjO(%AAb7dhhNGrF~Pu7wqaSeK?-ttJO2IkeFSt4qPlh9uP)=TU5{GMq1X2{p)EyFZ6j%rBgB43CTP2znJ7PJ2j3Y~vHMo;jO!?kCg7izdp?Qu`@LY5SEO?<SS_yzYJQhBy87_%r@Srx#XI8Tr{`r?s#k+;wPwph8;;s)4JN^qMCsTj&^Hhe)7+WXsFFU&!+<@0g$=tB(2u$|;9^OXYw0y~N0DeYsr#<j+Q|wVmXW-7;D63q;gwg_Xd~u-d{r}1ej+KWs)D)TRprx<Xky=HqTHOu>h7xYiksbB0PtQ`l_SZ>gpvPwhE<)6Jr@aMd;)xhf527{v&I5?1=9;CL_-Tm+Lj9_a|+M4fCqs$;HSYe(Exa@92DT)S+#c})LtYCT&la?+cj6u$_Tn%*;2RjX`*QwZ}v?O>;?-MlX~gPy0O=7%wmV3*EQe*?2%PQ;lef5k_0-<qEgWPvDbX6yW0WJuSKxmeL2gLx8y<lt`%x!oV`%%h%f<y1d5ela*uRJQ-B5V=+Ipu-cV~=2QC&gdv~ve*B8E?W%IPi*E<~VsKYl1+bdOVj>}G7mu8vYz8)N!0f&}4tmo3kZI&hkHK>hU8mR<P&>AzspWB^_W0NwH=de;iv}e=BCFPoRLEQhqF|tZ?c>edt-`@Xl|K^2QA9+B(|JL6=-8x97C%UFJ=czzVrm>u~@(I#K^3{tuH88=Gf67WN%}UAGpjQuXzkEw<UbPC+yx1%ECwSY?pe}_`trwBEiMrngpwrzh(cF6RHKA;82jtmfaco0g{Ps!m#LZ}Tl<whj9VxB*BrW`A^L>2ruBiV9?Y&xFCc6Zn@vdJl;x<J&4AbO?%?Pf1-(Yp_xyS&uvTcBpfRmhb<j+?FXr+Vu#0n;wlwjmVDFMpV^;GX8D;NrZN|w>G(S01iNvD4SQWFTn)WGJ*20sjOcT(oGVuyG7DjbN`VUM(#Av?bgb57C7eK<I2#4(GnCGNx`7Wv55Jr-fpX}Oq)lCOc<<o6P~Yy*DQ4P(f|bkT?eA1f@nh-;ELnex2`bC$n9qLHZ3udR_*E?P?#i}@^xD31d&spm~3<JQzjE3JVh79CtGb$r%ENAQz2lHK=pm<t-F4Y*s~P;xvqAVk+4OqM9~<cDDL^D_Pmt*M<}2byt)+jTU+%VeD?gPD30ufUu*XJZD_wF;rn%9ozti`H;?_;|4}r*e`VcQ=#2BLow|7Mk&3BGcrn2W5($*^a>E%WMfI40XamIm)GJGk?B%Fu^E7nBfq6SVcQHs+?np(5&Jf34eCfJu=Fz!<Rf6A9LF{2wL@gv<ekl!v3I29ZRB|v_zXuMu%p-gOT}>+rt_9sI@(gwesxAm`dIry*H*`_UpGZ?)D@t`_$aNAX0PNR54BlhmBKvyj=#h@Ga*AD0Y7kYuz|QEJ#`zoZXcYHJyel=^N#T(>EstMQE|oq}T695vK3AQi{2$m`XjNYso}R-K+<aiKoN@GV`g@r!M6XTi<VG4;c%4YZP`^ioBr|F%RYqPljdN-$}+;)&|q>3$q)NgvfWA*(z|m9i-8BKv@nwWC{U)z6vOq1_ceMJbk7G%I`oa*U`G*WTgVHlv@SVkXh)G<b9+IP+?~loaveckgY_#mCPeSjoxvgdS=<w+7K|6YR?#ymM76Zz4Tsq%f+kD2kwjem-lZW8q(n74cu~Ey&uu3SQW^|`-iVy!_C8+m-pYkv|q*`5Bz059quX7c(M&;6jLlO$6MdlWEA@c+y4c!zaY(Y+2#6-ioGAE9j8Xz<tkLmzri8u!PmjR{w86w(blrx;W^N|sTOP7_RwRvwc3BUVS}M|zwy=)HlLAnwMl<x)AKO$J|wSmx%$;BCh(wogKJ1{s59LwQRVT%tX(q2bAQQ%h~DK(re8k-I(Yc?m#8hr-a;!EO%U%l-^II+A2$ylKXxS3nt$!Rf4nG;xv+%nj`>9kdxXV2DgqN+ziz#bKw1$W2f<O)QNkmtsbi-Fa-zyJ*?Q_|hzQfGincnk3v)(woTzZ!+1Z`}u8JgtU}r5RsCI%70>a9x>EugowgSYGs_9CqZLyj`H7_W5H4Ru<OpunNLK^vlldt7a1==z(^h>srR_l@~#TsM{-2jFCwB%K6=6r-2d7b7Nob+sQq73<h4g;-~H#1LpraqD>ecTN1!VfIn#QGd;C50}%tQxot2Sx>1zH4;kXXvI>WtrnypOLN+Eu*v)JBE>F9Yh;)u_VtWqvfHajq}!T&D8eLN$1UiL+3!59aZhU;olP}^b>hPh4N4J3wg}Sb8KWrdZ`k0EORDrx@Dp<r&s?a3F=4Tx9IyhewpK>V@Z~GJ?nmgEPpu}?8mf=S#U@N>tT4m3wn$td2Sfv0w(m}bQOI+uv^{fFnn%#oN_ucRep}^&|HAivA{@K<$S*(THWi=pf4~`vnqhbnV}|y3q{};9TdUgW#Zr%Z0y}xdns7!E)W8LZ^WM&fMWcap$M0?S39Jg@wYhF)y^x>e$FAxZ(nn)!aH3f?`WOTm3BT?#5-Os@8*i-ZmwAF_KM|huUPKxiskOESnmFc<?gRo?%|5%9#)e3)Ww4VXH<n}PpbM_I^P|2iCQ_lTxul+4b)5EEx5#NmsaEm`H}F)BmWWbP<_Eq8=`_p-iimW$7B7Y;W<nd2~pqbE8IhgakC2Jb1xsgH1zB7?U7~%G7^fGs*>*<&!_reHC5{Onlx97V%DwNnwywVy4LCuBn`!^RNc{#9FU0y>5WIATnFks199GCyQ70(l!D9s_x|?jR*Y`~n5^&w$R_c8_N~qw8>!!Iqq%VFv||~sjb(FvQa0BoWqW;6w$~?RcYRWJ*C%CveNy&km-6C(YgeC+wb9v4z||#c1zfu#c5H@ccgpmPJ9of!2z*~1)Ycy7o{1#nvaW=0w(xz(=m~Tby2u|~KKM$ojVet|?GmLab%+Icy92MhfJep=g)Z_3=K(*n0In~C)Ow6#ok{DWb3Nv9I39hM@%=OH1Cc_IdFpeXWdvuR-efF$lOf|1U5Ib*U%ceV*XzJ*#moFfdoWB0K7RN2dwGlMExD*}DTL4J5yfx6{Pg4d4?q0(&!2w&wfp8N<1VF9ud&DGiFPO04I5A;QEE=+t@<lI{Ks~i-F*urPh#T!?i$%<V*N!bd~qbEjpbOh$8@e|E~rw*!P6yhZ5{PTB1XG$B~2b0sO%um{W7Ns{wFQ$0vK$r*f|(1(AY7WW|SN*;1@4t%9Fga!*;!uLc(GG{DhbjO;QbmFsvGPKmE+Y`qw+Dr}@7RAKxY6#S^Ou^Je|jj!Z<UT<kJ*oB44#gK39(L!vv3>51HGJ{ijMVu*7;{HkNe8Bn{{NVtPDaTnAK?vNeTx!fIP!GpDxk(|YXC!%D{oHvIp_z^9bmQ0147OKhNUHK^DjEu648+ksqx3t85@p4X=q?8vhP3&~{8^=?pXIds=`}K*#(X1Ez=LM*SbiJSI0Jh^$yLKt)Ik`0CafSjrx3U6T!?E;Sae}eopi^t&ea=D?$IN@x?;=y!xJ<R}M@g4s<Qx$B8MecPm371+YsnmcGSF;64&D1LVT*$6-vauLFKJR@#i98tc)FOy*UHfJ;*-X;7vD(xi)lvHV=UP*93AE`xW2Q18!Ty>AqH@fQJZ$w;S6(Nh%U#IkO`$&>Au=|9h8XjMK$RpdH!?7P)K_dl&=_$P|`Gp15X+WEn(ae&2Wo7JW835787X>ZbF#vRG^z3869)O1?$K9ZSNVB3D)OSP{Yonf$;=Mrpd#E#u6mQ;2Bb1xc=~I3_jHA!;}BjrJ2eowDSH9vz5uXkLT4XXKsh`ku8d;Y|U&oXYD2FKGiQ#bO<z34BN_gm{4O1PR10@VXArDJe#S-3))<nu|HRvt(}#xOLMeUJ%m>?gV)?omR-Y@d97_~IUc(tjZ?iYt8SWAH+_uHV|C(M5%~Xy5Wvit%-ytmbI#+_)#Ac-Z>XG&-@JVTufL1N1Z(0A-70|3W~kAOF_8~neUJVv#*SFL8tjXthfkD<9D4kJXIHxeFa!f1Xg`+pL(=zuv8_dl)!2R$IUE{k?>tyQG;@Sdur{z|EBi2R&kV;iuHnwoGxxC{>H8pdmY&FWD3RsU)CFA3s!a#f91xYLY`xmN3}3_q+T!WVz9Bx$iU<S(`G6D0J|($_4oPmI7mFgif?ks23;Kj0OD_t-z2%&-gN4%=Q-IcCKhwC44o$lgLF-Qv5pgx^s}um5Q=qxoGxFeK{{@^Ez&QdA``q0D{`w$YSh1EDcd!Bg'
  }
};
