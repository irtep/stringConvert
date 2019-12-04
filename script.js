const clickListener = document.getElementById('confirmButton').addEventListener('click', convert);

// copy variable as it was at the moment
function freezeCopy(target){
  return JSON.parse(JSON.stringify(target));
}

function makeEntry(str, toWhere) {
  let skillsPercent = null;
  let skillsName = null;
  let newStr = null;
  let isSkill = false;
  let requirement = false;
  /*
  0: ": Has trained Plant lore to 16"
  */
  /*
  
0: SkillSpell {name: "Tree herding", skill: true, spell: false, levels: Array(3), cost: 398}
1: SkillSpell {name: "Travel", skill: false, spell: true, levels: Array(3), cost: 417}
  */
  switch (toWhere) {
    // remove extra parts and add info if skill or requirement  
    case 'requiredSkills':
      newStr = str.replace(': ', '').replace('Has trained ', '').replace(' to ', '');
      requirement = true;
      isSkill = true;
    break;
    case 'requiredSpells':
      newStr = str.replace(': ', '').replace('Has studied ', '').replace(' to ', '');
      requirement = true;
    break;
    case 'availableSkills':
      newStr = str.replace(': ', '').replace('May train ', '').replace(' to ', '').replace('Available', '');
      isSkill = true;
    break;
    case 'availableSpells':
      newStr = str.replace(': ', '').replace('May study ', '').replace(' to ', '').replace('Available', '');
    break;
  
    default: console.log('not found toWhere');  
  }
  
  // check if percent has three, two or one digits
  const lastDig = Number.isInteger(parseInt(newStr[newStr.length-1]));
  const secondLastDig = Number.isInteger(parseInt(newStr[newStr.length-2]));
  const thirdLastDig = Number.isInteger(parseInt(newStr[newStr.length-3]));
      
  // make skill percent variable and cut extra lines from string that says skill name
  if (thirdLastDig) {
    skillsPercent = newStr[newStr.length-3] + newStr[newStr.length-2] + newStr[newStr.length-1];
    newStr = newStr.slice(0, -3);
  } else {
    if (secondLastDig) { 
      skillsPercent = newStr[newStr.length-2] + newStr[newStr.length-1];
      newStr = newStr.slice(0, -2);
    } else { 
      skillsPercent = newStr[newStr.length-1];
      newStr = newStr.slice(0, -1);
    }
  }
  // trim as they are some extra empty spaces sometimes.
  skillsName= newStr.trim();
  
  // make this from string to integer:
  skillsPercent = parseInt(skillsPercent);
  
  return [skillsName, skillsPercent, isSkill, requirement];
}

function convert(){
  const addGuild = document.getElementById('addGuild');
  const splitted = addGuild.value.split('Level');
  const required = [];
  //const requiredSpells = [];
  const available = [];
  //const availableSpells = [];
  const skills = [];
  let currentLevel = 1;
  let shortName = 'short name';
  let longName = 'long name';
  // the new guild place holder
  const newGuild = {
    longName: 'longName',
    shortName: 'shortName',
    skillsAndSpells: [],
    requirements: []
  }
  
  // check all levels that are split by all levels
  for (let i = 1; i < splitted.length; i++) { 
    
    const levels = splitted[i].split('Requirements');
    
    // check all levels
    for (let ii = 1; ii < levels.length; ii++) {
      
      // now splitted by each skill and spell
      const splitted2 = levels[ii].split('.');
      
      for (let iii = 0; iii < splitted2.length; iii++) {
        const reqSkillTest = splitted2[iii].includes('Has trained');
        const reqSpellTest = splitted2[iii].includes('Has studied');
        const avaSkillTest = splitted2[iii].includes('May train');
        const avaSpellTest = splitted2[iii].includes('May study');
        /*
        0: SkillSpell {name: "Tree herding", skill: true, spell: false, levels: Array(3), cost: 398}
        */
        if (reqSkillTest) { 
          const entry = makeEntry(splitted2[iii], 'requiredSkills');
          required.push({name: entry[0], level: i, percent: entry[1], skill: entry[2]});
          // needs still level number, its i or ii or something...need take the dog out now..
          // ["Plant lore", 16, true, true] // is skill, req
        }
        if (reqSpellTest) { 
          const entry = makeEntry(splitted2[iii], 'requiredSpells');
          required.push({name: entry[0], level: i, percent: entry[1], skill: entry[2]});
        }
        if (avaSkillTest) { // .split . pop part is to remove unwanted stuff before skills and spells
          const entry = makeEntry(splitted2[iii].split('May train ').pop(), 'availableSkills');
          available.push({name: entry[0], level: i, percent: entry[1], skill: entry[2]});
        }
        if (avaSpellTest) { 
          const entry = makeEntry(splitted2[iii].split('May study ').pop(), 'availableSpells');
          available.push({name: entry[0], level: i, percent: entry[1], skill: entry[2]});
        }
      }
    }
  }
  console.log('available: ', available);
  console.log('required: ', required);
    
  // sort available and required lists by level order
  const skillsByLevel = available.slice(0);
  skillsByLevel.sort((a,b) => {
    return a.level - b.level;
  });
  const requiredByLevel = required.slice(0);
  requiredByLevel.sort((a,b) => {
    return a.level - b.level;
  });
  
  // lets start to fill the newGuild
  // {name: "Tree herding", skill: true, spell: false, levels: Array(3), cost: 398}
  /*
  
level: 2
name: "Short blades"
percent: 20
skill: true
  */
  function addLevels(targetArray, level, percent) {
    
    // if first level
    if (level === 1) {
      
      targetArray.push(percent);
    } else {
      
      // first add zeros to fill empty levels
      for (let i = 1; i < level; i++) {
      
        targetArray.push(0);
      }
      
      // then add the percent
      targetArray.push(percent);
    }
    
    return targetArray;
  }
  
  let tempFalse = false;
  if (skillsByLevel[0].skill === false) { tempFalse = true; }
  
  newGuild.skillsAndSpells[0] = {
    name: skillsByLevel[0].name,
    skill: skillsByLevel[0].skill,
    spell: tempFalse,
    levels: [skillsByLevel[0].percent],
    cost: null // this will be null as cost comes from elsewhere
  }; 
  
  tempFalse = false;
  if (requiredByLevel[0].skill === false) { tempFalse = true; }
  
  newGuild.requirements[0] = {
    name: requiredByLevel[0].name,
    skill: requiredByLevel[0].skill,
    spell: tempFalse,
    levels: [requiredByLevel[0].percent],
    cost: null // this will be null as cost comes from elsewhere
  }; 
  
  // filling rest of the skills and spells
  for (let i = 1; i < skillsByLevel.length; i++) {
    let dublicated = false;
    const skillOnTurn = skillsByLevel[i];
    
    newGuild.skillsAndSpells.forEach( (skiSpe) => {
      
      if (skiSpe.name === skillOnTurn.name) {
        dublicated = true;
        // if next level, can push
        if (skillOnTurn.level === skiSpe.levels.length + 1) {
            skiSpe.levels.push(skillOnTurn.percent);
        } else {
          // if not next level...
          let difference = skillOnTurn.level - (skiSpe.levels.length + 1);
          
          for (; difference > 1; difference--) {
            skiSpe.levels.push(skiSpe.levels[skiSpe.levels.length-1])
          }
          skiSpe.levels.push(skillOnTurn.percent);
        }
      }
    });
    
    // if didn't find same
    if (dublicated) {
      const newSkillSpell = {
        name: skillOnTurn.name,
        skill: skillOnTurn.skill,
        spell: tempFalse,
        levels: [],
        cost: null // this will be null as cost comes from elsewhere
      };
      // add level percents
      newSkillSpell.levels = addLevels(newSkillSpell.levels, skillOnTurn.level, skillOnTurn.percent); 
    }
  }
  
  for (let i = 1; i < requiredByLevel.length; i++) {
    
  }
  console.log('newguild: ', newGuild);
  // tehään uusi array molemmille, niihin pushataan ekat ja sitten se käydään läpi
  // jos löytyy skilli ni sinne pushataan prossat jatkoksi samalla tarkistaa onko kaikki aiemmat, jos ei ni lisätään 0
  // sit alkaa olla jo aika lähellä sitä mitä pitää olla...
}
// prints "hi" in the browser's dev tools console
console.log("hi");
/*

  var str = "Hello world, welcome to the universe.";
  var n = str.includes("world");
*/
/*
okei... näyttää tältä suoraan stringinä:
Level 1 Requirements: Background must be Civilized. Available:  Receive a gift from the Guild of Alchemy May train Extract ether to 20. May train Plant lore to 20. May train Cast generic to 20. May train Attack to 10. May train Dissection to 10. May train Short blades to 10. May train Gutblade to 5. May train Make heatstick to 10. May train Mix juice to 20. May study Detect race to 10.   Level 2 Requirements: Has trained Plant lore to 16. Has trained Dissection to 8. Available: May train Extract ether to 40. May train Plant lore to 40. May train Cast generic to 40. May train Attack to 20. May train Dissection to 20. May train Long blades to 10. May train Short blades to 20. May train Gutblade to 10. May train Consider to 10. May train Make heatstick to 20. May train Mix juice to 30. May study Detect race to 20.

eli Level x kohdissa vaihtuu level... sitten tulee requirementsit...joka päättyy Available kohtaa..
kaikki aina päättyy pisteeseen..

tän näköstä sitten pitäisi olla:
longName: "The Navigators of the Tree"
mayTrain: Array(1)
skillsAndSpells: Array(2)
0: SkillSpell {name: "Tree herding", skill: true, spell: false, levels: Array(3), cost: 398}
1: SkillSpell {name: "Travel", skill: false, spell: true, levels: Array(3), cost: 417}
requirements: []
shortName: "Treenav"
          
nyt: 
0: ": Has trained Plant lore to 16"
1: " Has trained Dissection to 8"

eiköhän tää tästä...
eli tarvittas oikeestaan:
nimi, skill, spell, array jossa prossat

const newSkill = {
name: null,
requirements: [],
available: []
}

const requirements = [];
const available = [];
const 
*/


/*  so this should be converted:
Level 1
Requirements:
Background must be Civilized.
Available:

Receive a gift from the Guild of Alchemy
May train Extract ether to 20.
May train Plant lore to 20.
May train Cast generic to 20.
May train Attack to 10.
May train Dissection to 10.
May train Short blades to 10.
May train Gutblade to 5.
May train Make heatstick to 10.
May train Mix juice to 20.
May study Detect race to 10.

 Level 2
Requirements:
Has trained Plant lore to 16.
Has trained Dissection to 8.
Available:
May train Extract ether to 40.
May train Plant lore to 40.
May train Cast generic to 40.
May train Attack to 20.
May train Dissection to 20.
May train Long blades to 10.
May train Short blades to 20.
May train Gutblade to 10.
May train Consider to 10.
May train Make heatstick to 20.
May train Mix juice to 30.
May study Detect race to 20.

 Level 3
Requirements:
Has trained Plant lore to 32.
Has trained Dissection to 16.
Available:
May train Extract ether to 60.
May train Plant lore to 60.
May train Cast generic to 60.
May train Attack to 30.
May train Dissection to 30.
May train Long blades to 20.
May train Short blades to 30.
May train Gutblade to 15.
May train Consider to 20.
May train Make heatstick to 30.
May train Mix juice to 40.
May study Preserve corpse to 20.
May study Detect race to 30.

 Level 4
Requirements:
Has trained Plant lore to 48.
Has trained Dissection to 24.
Available:
May train Extract ether to 80.
May train Plant lore to 80.
May train Cast generic to 80.
May train Attack to 40.
May train Dissection to 40.
May train Long blades to 30.
May train Short blades to 40.
May train Gutblade to 20.
May train Consider to 30.
May train Make heatstick to 40.
May train Mix juice to 50.
May study Preserve corpse to 40.
May study Create money to 20.
May study Detect race to 40.

 Level 5
Requirements:
Has trained Plant lore to 64.
Has trained Dissection to 32.
Available:
May train Extract ether to 100.
May train Plant lore to 100.
May train Cast generic to 100.
May train Attack to 50.
May train Dissection to 50.
May train Long blades to 40.
May train Short blades to 50.
May train Gutblade to 25.
May train Consider to 40.
May train Mana control to 10.
May train Make heatstick to 50.
May train Mix juice to 60.
May study Preserve corpse to 60.
May study Create money to 40.
May study Detect race to 50.

 Level 6
Requirements:
Has trained Dissection to 40.
Available:
May train Mining to 40.
May train Attack to 60.
May train Dissection to 60.
May train Long blades to 50.
May train Short blades to 60.
May train Gutblade to 30.
May train Consider to 50.
May train Mana control to 20.
May train Cast special to 10.
May train Make heatstick to 60.
May train Mix juice to 70.
May study Preserve corpse to 80.
May study Create money to 60.
May study Create herb to 5.
May study Detect race to 60.

 Level 7
Requirements:
Has trained Dissection to 48.
Available:
May train Mining to 46.
May train Attack to 70.
May train Dissection to 70.
May train Long blades to 60.
May train Short blades to 70.
May train Gutblade to 35.
May train Consider to 60.
May train Mana control to 30.
May train Cast special to 20.
May train Cast information to 10.
May train Make heatstick to 70.
May train Mix juice to 80.
May study Preserve corpse to 100.
May study Create money to 80.
May study Create herb to 10.
May study Detect race to 70.

 Level 8
Requirements:
Has trained Dissection to 56.
Available:
May train Mining to 52.
May train Dissection to 80.
May train Long blades to 70.
May train Short blades to 80.
May train Gutblade to 40.
May train Consider to 70.
May train Mana control to 40.
May train Cast special to 30.
May train Cast information to 20.
May train Ceremony to 20.
May train Make heatstick to 80.
May train Mix juice to 90.
May study Create money to 100.
May study Create herb to 15.
May study Detect race to 80.

 Level 9
Requirements:
Has trained Dissection to 64.
Available:
May train Mining to 58.
May train Dissection to 90.
May train Gutblade to 45.
May train Consider to 80.
May train Mana control to 50.
May train Cast special to 40.
May train Cast information to 30.
May train Ceremony to 40.
May train Make heatstick to 90.
May train Mix juice to 100.
May study Create herb to 20.
May study Identify to 10.
May study Detect race to 90.
May study Aura detection to 10.

 Level 10
Requirements:
Has trained Dissection to 72.
Available:
May train Distillation to 20.
May train Mining to 64.
May train Dissection to 100.
May train Gutblade to 50.
May train Consider to 90.
May train Mana control to 60.
May train Cast special to 50.
May train Cast information to 40.
May train Ceremony to 60.
May train Mix drug to 10.
May train Throw control to 5.
May train Make heatstick to 100.
May train Eye of loraen to 10.
May study Create herb to 25.
May study Identify to 20.
May study Detect race to 100.
May study Aura detection to 20.
May study Instant fermentation to 10.

 Level 11
Requirements:
Has trained Throw control to 4.
Available:
May train Distillation to 28.
May train Mining to 70.
May train Gutblade to 55.
May train Consider to 100.
May train Cast special to 60.
May train Cast information to 50.
May train Ceremony to 80.
May train Make reagent to 10.
May train Mix drug to 20.
May train Throw control to 10.
May train Mix potion to 5.
May train Knowledge of alchemy to 5.
May train Eye of loraen to 14.
May train Modify ammunition to 10.
May study Create herb to 30.
May study Identify to 30.
May study Aura detection to 30.
May study Create dimensional gem to 5.
May study Instant fermentation to 20.

 Level 12
Requirements:
Has trained Throw control to 8.
Has trained Mix potion to 4.
Has trained Knowledge of alchemy to 4.
Available:
May train Distillation to 36.
May train Mining to 73.
May train Gutblade to 60.
May train Cast special to 70.
May train Cast information to 60.
May train Ceremony to 100.
May train Make reagent to 20.
May train Mix drug to 30.
May train Throw control to 15.
May train Mix potion to 10.
May train Knowledge of alchemy to 10.
May train Swift scalpel to 10.
May train Eye of loraen to 19.
May train Modify ammunition to 20.
May study Create herb to 35.
May study Identify to 40.
May study Aura detection to 40.
May study Create dimensional gem to 10.
May study Instant fermentation to 30.

 Level 13
Requirements:
Has trained Throw control to 12.
Has trained Mix potion to 8.
Has trained Knowledge of alchemy to 8.
Available:
May train Distillation to 44.
May train Mining to 76.
May train Gutblade to 65.
May train Cast special to 80.
May train Cast information to 70.
May train Make reagent to 30.
May train Mix drug to 40.
May train Throw control to 20.
May train Mix potion to 15.
May train Knowledge of alchemy to 15.
May train Swift scalpel to 20.
May train Decanting to 10.
May train Recanting to 10.
May train Mix salve to 10.
May train Eye of loraen to 23.
May train Modify ammunition to 30.
May study Create herb to 40.
May study Identify to 50.
May study Aura detection to 50.
May study Create dimensional gem to 15.
May study Instant fermentation to 40.

 Level 14
Requirements:
Has trained Throw control to 16.
Has trained Mix potion to 12.
Has trained Knowledge of alchemy to 12.
Available:
May train Distillation to 52.
May train Mining to 79.
May train Gutblade to 70.
May train Cast special to 90.
May train Cast information to 80.
May train Make reagent to 40.
May train Mix drug to 50.
May train Throw control to 25.
May train Mix potion to 20.
May train Knowledge of alchemy to 20.
May train Swift scalpel to 30.
May train Decanting to 20.
May train Recanting to 20.
May train Mix salve to 20.
May train Cast alchemy to 20.
May train Eye of loraen to 28.
May train Modify ammunition to 40.
May study Create herb to 45.
May study Identify to 60.
May study Aura detection to 60.
May study Create dimensional gem to 20.
May study Prepare flask to 10.
May study Floating disc to 10.
May study Instant fermentation to 50.

 Level 15
Requirements:
Has trained Throw control to 20.
Has trained Mix potion to 16.
Has trained Knowledge of alchemy to 16.
Has trained Cast alchemy to 16.
Has studied Prepare flask to 8.
Available:
May train Distillation to 60.
May train Mining to 82.
May train Gutblade to 75.
May train Cast special to 100.
May train Cast information to 90.
May train Make reagent to 50.
May train Mix drug to 60.
May train Throw control to 30.
May train Mix potion to 25.
May train Knowledge of alchemy to 25.
May train Swift scalpel to 40.
May train Decanting to 30.
May train Recanting to 30.
May train Mix salve to 30.
May train Cast alchemy to 40.
May train Eye of loraen to 32.
May train Modify ammunition to 50.
May study Create herb to 50.
May study Identify to 70.
May study Aura detection to 70.
May study Create dimensional gem to 25.
May study Prepare flask to 20.
May study Floating disc to 20.
May study Patch item to 10.
May study Water walking to 10.
May study Instant fermentation to 60.

 Level 16
Requirements:
Has trained Throw control to 24.
Has trained Mix potion to 20.
Has trained Knowledge of alchemy to 20.
Has trained Cast alchemy to 32.
Has studied Prepare flask to 16.
Available:
May train Distillation to 68.
May train Mining to 85.
May train Gutblade to 80.
May train Cast information to 100.
May train Make reagent to 60.
May train Mix drug to 70.
May train Throw control to 35.
May train Mix potion to 30.
May train Knowledge of alchemy to 30.
May train Swift scalpel to 50.
May train Decanting to 40.
May train Recanting to 40.
May train Mix salve to 40.
May train Cast alchemy to 60.
May train Eye of loraen to 37.
May train Modify ammunition to 60.
May study Create herb to 55.
May study Identify to 80.
May study Aura detection to 80.
May study Create dimensional gem to 30.
May study Prepare flask to 30.
May study Floating disc to 30.
May study Patch item to 20.
May study Water walking to 20.
May study Instant fermentation to 70.

 Level 17
Requirements:
Has trained Throw control to 28.
Has trained Mix potion to 24.
Has trained Knowledge of alchemy to 24.
Has trained Cast alchemy to 48.
Has studied Prepare flask to 24.
Available:
May train Distillation to 76.
May train Mining to 88.
May train Gutblade to 85.
May train Make reagent to 70.
May train Mix drug to 80.
May train Throw control to 40.
May train Mix potion to 35.
May train Knowledge of alchemy to 35.
May train Swift scalpel to 60.
May train Decanting to 50.
May train Recanting to 50.
May train Mix salve to 50.
May train Cast alchemy to 80.
May train Eye of loraen to 41.
May train Modify ammunition to 70.
May study Create herb to 60.
May study Identify to 90.
May study Aura detection to 90.
May study Create dimensional gem to 35.
May study Prepare flask to 40.
May study Floating disc to 40.
May study Patch item to 30.
May study Water walking to 30.
May study Dim to 10.
May study Instant fermentation to 80.

 Level 18
Requirements:
Has trained Throw control to 32.
Has trained Mix potion to 28.
Has trained Knowledge of alchemy to 28.
Has trained Cast alchemy to 64.
Has studied Prepare flask to 32.
Available:
May train Distillation to 84.
May train Mining to 91.
May train Gutblade to 90.
May train Make reagent to 80.
May train Mix drug to 90.
May train Throw control to 45.
May train Mix potion to 40.
May train Knowledge of alchemy to 40.
May train Swift scalpel to 70.
May train Decanting to 60.
May train Recanting to 60.
May train Mix salve to 60.
May train Cast alchemy to 100.
May train Eye of loraen to 46.
May train Modify ammunition to 80.
May study Create herb to 65.
May study Identify to 100.
May study Aura detection to 100.
May study Create dimensional gem to 40.
May study Prepare flask to 50.
May study Floating disc to 50.
May study Patch item to 40.
May study Water walking to 40.
May study Dim to 20.
May study Glow to 10.
May study Instant fermentation to 90.
May study Blessing of intoxication to 10.
May study Drunken stupor to 10.

 Level 19
Requirements:
Has trained Throw control to 36.
Has trained Mix potion to 32.
Has trained Knowledge of alchemy to 32.
Has studied Prepare flask to 40.
Available:
May train Distillation to 92.
May train Mining to 94.
May train Gutblade to 95.
May train Make reagent to 90.
May train Mix drug to 100.
May train Throw control to 50.
May train Mix potion to 45.
May train Knowledge of alchemy to 45.
May train Swift scalpel to 80.
May train Decanting to 70.
May train Recanting to 70.
May train Mix salve to 70.
May train Eye of loraen to 50.
May train Modify ammunition to 90.
May study Create herb to 70.
May study Create dimensional gem to 45.
May study Prepare flask to 60.
May study Floating disc to 60.
May study Patch item to 50.
May study Water walking to 50.
May study Dim to 30.
May study Glow to 20.
May study Feather weight to 10.
May study Instant fermentation to 100.
May study Blessing of intoxication to 20.
May study Drunken stupor to 20.

 Level 20
Requirements:
Has trained Throw control to 40.
Has trained Mix potion to 36.
Has trained Knowledge of alchemy to 36.
Has studied Prepare flask to 48.
Available:
May train Distillation to 100.
May train Mining to 97.
May train Gutblade to 100.
May train Make reagent to 100.
May train Throw control to 55.
May train Mix potion to 50.
May train Knowledge of alchemy to 50.
May train Swift scalpel to 90.
May train Decanting to 80.
May train Recanting to 80.
May train Mix salve to 80.
May train Eye of loraen to 55.
May train Modify ammunition to 100.
May study Create herb to 75.
May study Lift of load to 10.
May study Create dimensional gem to 50.
May study Prepare flask to 70.
May study Floating disc to 70.
May study Patch item to 60.
May study Water walking to 60.
May study Dim to 40.
May study Glow to 30.
May study Feather weight to 20.
May study Aegis to 10.
May study Blessing of intoxication to 30.
May study Drunken stupor to 30.

 Level 21
Requirements:
Has trained Throw control to 44.
Has trained Mix potion to 40.
Has trained Knowledge of alchemy to 40.
Has studied Prepare flask to 56.
Available:
May train Mining to 100.
May train Throw control to 60.
May train Mix potion to 55.
May train Knowledge of alchemy to 55.
May train Swift scalpel to 100.
May train Mint coins to 10.
May train Decanting to 90.
May train Recanting to 90.
May train Mix salve to 90.
May train Eye of loraen to 59.
May train Mix elixir to 10.
May train Make arrow of torture to 10.
May study Create herb to 80.
May study Lift of load to 18.
May study Create dimensional gem to 55.
May study Prepare flask to 80.
May study Floating disc to 80.
May study Patch item to 70.
May study Water walking to 70.
May study Dim to 50.
May study Glow to 40.
May study Feather weight to 30.
May study Aegis to 20.
May study Shift blade to 10.
May study Summon homonculus to 10.
May study Hangover cure to 10.
May study Blessing of intoxication to 40.
May study Drunken stupor to 40.

 Level 22
Requirements:
Has trained Throw control to 48.
Has trained Mix potion to 44.
Has trained Knowledge of alchemy to 44.
Has studied Prepare flask to 64.
Available:
May train Throw control to 65.
May train Mix potion to 60.
May train Knowledge of alchemy to 60.
May train Mint coins to 20.
May train Decanting to 100.
May train Recanting to 100.
May train Mix salve to 100.
May train Eye of loraen to 64.
May train Essence eye to 20.
May train Mix elixir to 20.
May train Make arrow of torture to 20.
May study Create herb to 85.
May study Lift of load to 26.
May study Create dimensional gem to 60.
May study Prepare flask to 90.
May study Floating disc to 90.
May study Patch item to 80.
May study Water walking to 80.
May study Dim to 60.
May study Glow to 50.
May study Feather weight to 40.
May study Aegis to 30.
May study Shift blade to 20.
May study Summon homonculus to 20.
May study Hangover cure to 20.
May study Blessing of intoxication to 50.
May study Drunken stupor to 50.

 Level 23
Requirements:
Has trained Throw control to 52.
Has trained Mix potion to 48.
Has trained Knowledge of alchemy to 48.
Has studied Prepare flask to 72.
Available:
May train Throw control to 70.
May train Mix potion to 65.
May train Knowledge of alchemy to 65.
May train Mint coins to 30.
May train Refining to 20.
May train Eye of loraen to 68.
May train Essence eye to 40.
May train Quick chant to 20.
May train Mix elixir to 30.
May train Make arrow of torture to 30.
May study Create herb to 90.
May study Lift of load to 34.
May study Create dimensional gem to 65.
May study Prepare flask to 100.
May study Floating disc to 100.
May study Patch item to 90.
May study Water walking to 90.
May study Dim to 70.
May study Glow to 60.
May study Feather weight to 50.
May study Aegis to 40.
May study Shift blade to 30.
May study Summon homonculus to 30.
May study Hangover cure to 30.
May study Blessing of intoxication to 60.
May study Drunken stupor to 60.

 Level 24
Requirements:
Has trained Throw control to 56.
Has trained Mix potion to 52.
Has trained Knowledge of alchemy to 52.
Available:
May train Throw control to 75.
May train Mix potion to 70.
May train Knowledge of alchemy to 70.
May train Mint coins to 40.
May train Refining to 27.
May train Eye of loraen to 73.
May train Essence eye to 60.
May train Quick chant to 40.
May train Mix elixir to 40.
May train Make arrow of torture to 40.
May study Create herb to 95.
May study Lift of load to 42.
May study Create dimensional gem to 70.
May study Patch item to 100.
May study Water walking to 100.
May study Dim to 80.
May study Glow to 70.
May study Feather weight to 60.
May study Aegis to 50.
May study Shift blade to 40.
May study Summon homonculus to 40.
May study Hangover cure to 40.
May study Blessing of intoxication to 70.
May study Drunken stupor to 70.

 Level 25
Requirements:
Has trained Throw control to 60.
Has trained Mix potion to 56.
Has trained Knowledge of alchemy to 56.
Available:
May train Throw control to 80.
May train Mix potion to 75.
May train Knowledge of alchemy to 75.
May train Mint coins to 50.
May train Refining to 35.
May train Eye of loraen to 77.
May train Essence eye to 80.
May train Quick chant to 60.
May train Mix elixir to 50.
May train Make arrow of torture to 50.
May study Create herb to 100.
May study Lift of load to 50.
May study Create dimensional gem to 75.
May study Dim to 90.
May study Glow to 80.
May study Feather weight to 70.
May study Aegis to 60.
May study Shift blade to 50.
May study Summon homonculus to 50.
May study Hangover cure to 50.
May study Blessing of intoxication to 80.
May study Drunken stupor to 80.

 Level 26
Requirements:
Has trained Throw control to 64.
Has trained Mix potion to 60.
Has trained Knowledge of alchemy to 60.
Available:
May train Throw control to 85.
May train Mix potion to 80.
May train Knowledge of alchemy to 80.
May train Mint coins to 60.
May train Refining to 43.
May train Eye of loraen to 82.
May train Essence eye to 100.
May train Blacksmithing to 10.
May train Alloying to 20.
May train Amalgamate to 20.
May train Cannibalize to 20.
May train Mix elixir to 60.
May train Make arrow of torture to 60.
May study Create dimensional gem to 80.
May study Dim to 100.
May study Glow to 90.
May study Feather weight to 80.
May study Aegis to 70.
May study Shift blade to 60.
May study Summon homonculus to 60.
May study Hangover cure to 60.
May study Blessing of intoxication to 90.
May study Drunken stupor to 90.

 Level 27
Requirements:
Has trained Throw control to 68.
Has trained Mix potion to 64.
Has trained Knowledge of alchemy to 64.
Available:
May train Throw control to 90.
May train Mix potion to 85.
May train Knowledge of alchemy to 85.
May train Mint coins to 70.
May train Refining to 51.
May train Eye of loraen to 86.
May train Blacksmithing to 20.
May train Alloying to 40.
May train Amalgamate to 40.
May train Cannibalize to 40.
May train Mix elixir to 70.
May train Make arrow of torture to 70.
May study Create dimensional gem to 85.
May study Glow to 100.
May study Feather weight to 90.
May study Aegis to 80.
May study Shift blade to 70.
May study Summon homonculus to 70.
May study Mould ring to 25.
May study Sneezing powder to 25.
May study Hangover cure to 70.
May study Blessing of intoxication to 100.
May study Drunken stupor to 100.

 Level 28
Requirements:
Has trained Throw control to 72.
Has trained Mix potion to 68.
Has trained Knowledge of alchemy to 68.
Available:
May train Throw control to 95.
May train Mix potion to 90.
May train Knowledge of alchemy to 90.
May train Mint coins to 80.
May train Refining to 59.
May train Eye of loraen to 91.
May train Blacksmithing to 30.
May train Alloying to 60.
May train Amalgamate to 60.
May train Cannibalize to 60.
May train Mix elixir to 80.
May train Make arrow of torture to 80.
May study Create dimensional gem to 90.
May study Feather weight to 100.
May study Aegis to 90.
May study Shift blade to 80.
May study Summon homonculus to 80.
May study Mould ring to 50.
May study Sneezing powder to 50.
May study Hangover cure to 80.

 Level 29
Requirements:
Has trained Throw control to 76.
Has trained Mix potion to 72.
Has trained Knowledge of alchemy to 72.
Available:
May train Throw control to 100.
May train Mix potion to 95.
May train Knowledge of alchemy to 95.
May train Mint coins to 90.
May train Refining to 67.
May train Eye of loraen to 95.
May train Blacksmithing to 40.
May train Alloying to 80.
May train Amalgamate to 80.
May train Cannibalize to 80.
May train Mix elixir to 90.
May train Make arrow of torture to 90.
May study Create dimensional gem to 95.
May study Aegis to 100.
May study Shift blade to 90.
May study Summon homonculus to 90.
May study Mould ring to 75.
May study Sneezing powder to 75.
May study Hangover cure to 90.

 Level 30
Requirements:
Has trained Mix potion to 76.
Has trained Knowledge of alchemy to 76.
Available:
May train Mix potion to 100.
May train Knowledge of alchemy to 100.
May train Mint coins to 100.
May train Refining to 75.
May train Eye of loraen to 100.
May train Blacksmithing to 50.
May train Alloying to 100.
May train Amalgamate to 100.
May train Cannibalize to 100.
May train Mix elixir to 100.
May train Make arrow of torture to 100.
May study Create dimensional gem to 100.
May study Shift blade to 100.
May study Summon homonculus to 100.
May study Mould ring to 100.
May study Sneezing powder to 100.
May study Hangover cure to 100.

*/
