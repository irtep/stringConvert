/*  this is what they should look like:
new Guild('Disciple', 'The Disciples of Chaos',
  // requirements:                                     
    [],                                      
  // skills and spells:
    [{
      skillsAndSpells: [  // nimi, skilli, spelli
        // Skills:
        new SkillSpell('Alertness', true, false, 
          [5, 7, 10, 13, 16, 18, 21, 24, 27, 30] // paljon saa per leveli, 1, 2 , 3, 4, 5
          , 288),  // skillcost ekalle 5% tälle...ei tarvii laittaa mitään, tää tulee muualta
        new SkillSpell('Attack', true, false, 
          [20, 26, 32, 38, 44, 50, 56, 62, 68, 75] // paljon saa per leveli, 1, 2 , 3, 4, 5
          , 288),
        new SkillSpell('Bludgeons', true, false, 
          [0, 0, 10, 15, 21, 27, 32, 38, 44, 50] // paljon saa per leveli, 1, 2 , 3, 4, 5
          , 288),
        new SkillSpell('Chaotic spawn', true, false, 
          [10, 14, 18, 23, 27, 32, 36, 41, 45, 50] // paljon saa per leveli, 1, 2 , 3, 4, 5
          , 288),
        new SkillSpell('Choreography of mutilation', true, false, 
          [0, 0, 0, 0, 5, 6, 7, 8, 9, 10] // paljon saa per leveli, 1, 2 , 3, 4, 5
          , 288),
        new SkillSpell('Clawed strike', true, false, 
          [10, 14, 18, 23, 27, 32, 36, 41, 45, 50] 
          , 491),
        new SkillSpell('Consider', true, false, 
          [10, 16, 23, 29, 36, 43, 49, 56, 63, 70] 
          , 253),
        new SkillSpell('Controlled panic', true, false, 
          [10, 12, 14, 16, 18, 21, 23, 25, 27, 30] 
          , 253),
        new SkillSpell('Darkness', false, true, 
          [10, 17, 24, 31, 38, 46, 53, 60, 67, 75] 
          , 253),
        new SkillSpell('Dodge', true, false, 
          [10, 12, 14, 16, 18, 21, 23, 25, 27, 30] 
          , 253),
        new SkillSpell('Enhance criticals', true, false, 
          [0, 0, 0, 0, 5, 6, 7, 8, 9, 10] 
          , 253),
        new SkillSpell('Greater darkness', false, true, 
          [0, 0, 0, 0, 10, 18, 26, 34, 42, 50] 
          , 253),
        new SkillSpell('Hiking', true, false, 
          [5, 7, 10, 13, 16, 18, 21, 24, 27, 30] 
          , 253),
        new SkillSpell('Kick', true, false, 
          [0, 0, 0, 0, 10, 20, 30, 40, 50, 60] 
          , 253),
        new SkillSpell('Kiss of death', true, false, 
          [10, 15, 20, 25, 30, 30, 30, 30, 30, 30] 
          , 253),
        new SkillSpell('Long blades', true, false, 
          [0, 0, 0, 0, 10, 18, 26, 34, 42, 50] 
          , 253),
        new SkillSpell('Negate offhand penalty', true, false,
         [0, 0, 0, 0, 10, 14, 18, 22, 26, 30]
          , 0),
        new SkillSpell('Polearms', true, false,
           [0, 0, 0, 0, 0, 0, 10, 23, 36, 50]
            , 0),
        new SkillSpell('Push', true, false,
           [20, 28, 37, 46, 55, 64, 73, 82, 91, 100]
            , 0),
        new SkillSpell('Short blades', true, false,
           [10, 14, 18, 23, 27, 32, 36, 41, 45, 50]
            , 0),
        new SkillSpell('Stun', true, false,
           [0, 0, 0, 0, 10, 12, 14, 16, 18, 20]
            , 0),
        new SkillSpell('Swim', true, false,
           [10, 14, 18, 23, 27, 32, 36, 41, 45, 50]
            , 0),
        new SkillSpell('Throw weight', true, false,
           [5, 7, 10, 13, 16, 18, 21, 24, 27, 30]
            , 0),
        new SkillSpell('Tinning', true, false,
           [20, 28, 37, 46, 55, 64, 73, 82, 91, 100]
            , 0),
        new SkillSpell('Torch creation', true, false,
           [10, 14, 18, 23, 27, 32, 36, 41, 45, 50]
            , 0),
        new SkillSpell('Tumbling attack', true, false,
           [0, 0, 0, 0, 5, 10, 15, 20, 25, 30]
            , 0)
      ]
    }]                                   
  )
  
  */