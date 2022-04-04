const sampleData = {
  samples: [
    {
      person: {
        familyId: "FAM001",
        individualId: "Patient",
        paternalId: "Father",
        maternalId: "Mother",
        sex: "MALE",
        affectedStatus: "AFFECTED",
      },
      index: 0,
      proband: true,
    },
    {
      person: {
        familyId: "FAM001",
        individualId: "Mother",
        paternalId: "0",
        maternalId: "0",
        sex: "FEMALE",
        affectedStatus: "UNAFFECTED",
      },
      index: 1,
      proband: false,
    },
    {
      person: {
        familyId: "FAM001",
        individualId: "Father",
        paternalId: "0",
        maternalId: "0",
        sex: "MALE",
        affectedStatus: "AFFECTED",
      },
      index: 2,
      proband: false,
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
        id: "Patient",
      },
    },
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
        id: "Mother",
      },
    },
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
        id: "Father",
      },
    },
  ],
};

export default sampleData;
