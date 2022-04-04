const sampleData = {
  samples: [
    {
      person: {
        familyId: "FAM001",
        individualId: "SAMPLE1",
        sex: "MALE",
        affectedStatus: "AFFECTED",
      },
      index: 0,
      proband: true,
    },
  ],
  phenotypes: [
    {
      phenotypicFeaturesList: [
        {
          type: {
            id: "HP:0000951",
            label: "HP:0000951",
          },
        },
      ],
      subject: {
        id: "SAMPLE1",
      },
    },
  ],
};

export default sampleData;
