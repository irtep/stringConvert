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

 // Adds percents of levels
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

function convert(){
  const addGuild = document.getElementById('addGuild');
  const splitted = addGuild.value.split('Level');
  const required = [];
  const available = [];
  const skills = [];
  let currentLevel = 1;
  let shortName = document.getElementById('shortNameOfGuild');
  let longName = document.getElementById('longNameOfGuild');
  let maxLevels = document.getElementById('maxLevelsOfGuild');
  // the new guild place holder
  // shortname, longname and maxlevels should be added by user
  const newGuild = {
    maxLevels: maxLevels.value,
    longName: longName.value,
    shortName: shortName.value,
    skillsAndSpells: [],
    requirements: []
  }
  // to here we pushed skills that are already on list
  const wroteAvailable = [];
  const wroteRequired = [];
  // helper to write 1st skills and spells to newGuild
  let tempFalse = false;
  
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
  if (skillsByLevel[0].skill === false) { tempFalse = true; }
  
  // add first skill and spell, to get length of lists to 1
  newGuild.skillsAndSpells[0] = {
    name: skillsByLevel[0].name,
    skill: skillsByLevel[0].skill,
    spell: tempFalse,
    levels: [skillsByLevel[0].percent],
    cost: null // this will be null as cost comes from elsewhere
  }; 
  wroteAvailable.push(skillsByLevel[0].name);
  
  tempFalse = false;
  
  // if guild has requirements
  if (requiredByLevel[0] !== undefined) {
    
    if (requiredByLevel[0].skill === false) { tempFalse = true; }

    newGuild.requirements[0] = {
      name: requiredByLevel[0].name,
      skill: requiredByLevel[0].skill,
      spell: tempFalse,
      levels: [requiredByLevel[0].percent],
      cost: null // this will be null as cost comes from elsewhere
    }; 
    wroteRequired.push(requiredByLevel[0].name);  
  } 
  
  // filling rest of the skills and spells
  skillsByLevel.forEach( (skill) => {
    let dublicated = {result: false, index: null};
    
    // check that this is not already wrote
    for (let i = 0; i < wroteAvailable.length; i++) {
    
      if (skill.name === wroteAvailable[i]) {
        dublicated.result = true;
        dublicated.index = i;
      }
    }
    
    // already added one entry of this skill
    if (dublicated.result) {
      
      // if next level, can push
      if (skill.level === newGuild.skillsAndSpells[dublicated.index].levels.length + 1) {
        
        newGuild.skillsAndSpells[dublicated.index].levels.push(skill.percent);
      } else {
        
        // if not next level, need to fill until that level
        let difference = skill.level - (newGuild.skillsAndSpells[dublicated.index].levels.length + 1);
          
        for (; difference > 1; difference--) {
          newGuild.skillsAndSpells[dublicated.index].levels.push(newGuild.skillsAndSpells[dublicated.index].levels[newGuild.skillsAndSpells[dublicated.index].levels.length-1])
        }
        
        newGuild.skillsAndSpells[dublicated.index].levels.push(skill.percent);
      }      
    } else {
      
      if (skill.skill === false) { tempFalse = true; }
      
        // new skill
        const newSkillSpell = {
          name: skill.name,
          skill: skill.skill,
          spell: tempFalse,
          levels: [],
          cost: null // this will be null as cost comes from elsewhere
        }
      
        // add level percents
        newSkillSpell.levels = addLevels(newSkillSpell.levels, skill.level, skill.percent); 
      
        // add to its place 
        newGuild.skillsAndSpells.push(newSkillSpell); 
        // and to wrote list so it wont be added again
        wroteAvailable.push(newSkillSpell.name);
    }
  });
   
  // fill rest of the levels on those entries that doesn't get any extra percents later
  newGuild.skillsAndSpells.forEach( (skill) => {
    
    // if skill doesn't have enough levels, lets add
    if (skill.levels.length < newGuild.maxLevels){
      
      for (let i = skill.levels.length; i < newGuild.maxLevels; i++) {
        
        skill.levels.push(skill.levels[i-1]);
      }
    }
  });
  
  // do same for level requirements:
  // filling rest of the skills and spells
  requiredByLevel.forEach( (skill) => {
    let dublicated = {result: false, index: null};
    
    // check that this is not already wrote
    for (let i = 0; i < wroteRequired.length; i++) {
    
      if (skill.name === wroteRequired[i]) {
        dublicated.result = true;
        dublicated.index = i;
      }
    }
    
    // already added one entry of this skill
    if (dublicated.result) {
      
      // if next level, can push
      if (skill.level === newGuild.requirements[dublicated.index].levels.length + 1) {
        
        newGuild.requirements[dublicated.index].levels.push(skill.percent);
      } else {
        
        // if not next level, need to fill until that level
        let difference = skill.level - (newGuild.requirements[dublicated.index].levels.length + 1);
          
        for (; difference > 1; difference--) {
          newGuild.requirements[dublicated.index].levels.push(newGuild.requirements[dublicated.index].levels[newGuild.requirements[dublicated.index].levels.length-1])
        }
        
        newGuild.requirements[dublicated.index].levels.push(skill.percent);
      }      
    } else {
      
      if (skill.skill === false) { tempFalse = true; }
      
        // new skill
        const newSkillSpell = {
          name: skill.name,
          skill: skill.skill,
          spell: tempFalse,
          levels: [],
          cost: null // this will be null as cost comes from elsewhere
        }
      
        // add level percents
        newSkillSpell.levels = addLevels(newSkillSpell.levels, skill.level, skill.percent); 
      
        // add to its place 
        newGuild.requirements.push(newSkillSpell); 
        // and to wrote list so it wont be added again
        wroteRequired.push(newSkillSpell.name);
    }
  });
  
  // fill rest of the levels on those entries that doesn't get any extra percents later
  newGuild.requirements.forEach( (skill) => {
    
    // if skill doesn't have enough levels, lets add
    if (skill.levels.length < newGuild.maxLevels){
      
      for (let i = skill.levels.length; i < newGuild.maxLevels; i++) {
        
        skill.levels.push(skill.levels[i-1]);
      }
    }
  });  
  
  // stringify
  const guildPacked = JSON.stringify(newGuild);
  
  // copy guildPacked to clipboard. ready to be exported to reinc simulator:
  
  // Create a dummy input to copy the string array inside it
  const dummy = document.createElement("input");

  // Add it to the document
  document.body.appendChild(dummy);

  // Set its ID
  dummy.setAttribute("id", "dummy_id");

  // Output the array into it
  document.getElementById("dummy_id").value = guildPacked;

  // Select it
  dummy.select();

  // Copy its contents
  document.execCommand("copy");

  // Remove it as its not needed anymore
  document.body.removeChild(dummy);
  
  // add result:
  document.getElementById('result').innerHTML = 'guild packet copied to clipboard!'
}
// prints "hi" in the browser's dev tools console
console.log("hi");
