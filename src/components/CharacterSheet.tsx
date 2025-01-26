import { useEffect, useState } from 'react';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../consts';

const CharacterSheet = ({charName}) => {
    const MAX_ATTRIBUTE_SUM = 70
    const [attributesArr, setAttributesArr] = useState([])
    const [classArr, setClassArr] = useState([])
    const [minRequirement, setMinRequirement] = useState({})
    const [skillsArr, setSkillsArr] = useState([])
    const [chosenSkill, setChosenSkill] = useState({
        name: '',
        score: 0
    })
    const [diceRoll, setDiceRoll] = useState(0)
    const [dc, setDc] = useState(0)
    const [result, setResult] = useState('failure')
  
    useEffect(() => {
      const initialAttributeArray = []
      for(let i=0; i<ATTRIBUTE_LIST.length; i++) {
        initialAttributeArray.push({
          name: ATTRIBUTE_LIST[i],
          score: 0,
          abilityModifier: computeAbilityModifier(0)
        })
      }
      setAttributesArr([...initialAttributeArray])
  
      const initialSkillsArr = []
      for(let i=0; i<SKILL_LIST.length; i++) {
        initialSkillsArr.push({
          name: SKILL_LIST[i].name,
          attributeModifier: SKILL_LIST[i].attributeModifier,
          spentScore: 0,
          total: 0,
          modifierScore: initialAttributeArray.find((attr) => attr.name === SKILL_LIST[i].attributeModifier)?.abilityModifier
        })
      }
      setSkillsArr([...initialSkillsArr])
  
      const initialClassArr = []
      for(let character in CLASS_LIST) {
        initialClassArr.push({
          name: character,
          isQualified: false
        })
      }
      setClassArr([...initialClassArr])
    },[])
  
    useEffect(() => {
      if (attributesArr.length) {
        // check if any class becomes qualified
      setClassArr((prevClassArr) =>
        prevClassArr.map((characterClass) => {
          const isQualified = Object.entries(CLASS_LIST[characterClass.name]).every(([attribute, requiredScore]) => {
            const findAttr = attributesArr.find((att) => att.name === attribute);
            return findAttr && findAttr.score >= requiredScore;
          });
          return { ...characterClass, isQualified };
        })
      );
  
      // set modifier score in skills array 
      setSkillsArr((prevSkillsArr) =>
        prevSkillsArr.map((skill) => {
          const attribute = attributesArr.find((attr) => attr.name === skill.attributeModifier);
          const modifierScore = attribute ? attribute.abilityModifier : 0;
          return {
            ...skill,
            modifierScore,
            total: skill.spentScore + modifierScore,
          };
        }))
      }
    }, [attributesArr])
  
    const increaseSkillScore = (index: number) =>{
      const newSkills = [...skillsArr]
        const sum = skillsArr.reduce((acc, skill) => acc + skill.spentScore, 0)
        if (sum < totalSkillPoints()) {
          newSkills[index].spentScore = newSkills[index].spentScore + 1
          newSkills[index].total = newSkills[index].spentScore + newSkills[index].modifierScore
          setSkillsArr([...newSkills])
        } else {
        alert('You need more skill points ! Upgrade your intelligence to get more')
      }
    }
  
    const decreaseSkillScore = (index: number) =>{
      const newSkills = [...skillsArr]
      newSkills[index].spentScore = newSkills[index].spentScore - 1
      newSkills[index].total = newSkills[index].spentScore + newSkills[index].modifierScore
      setSkillsArr([...newSkills])
    }
  
  
    const computeAbilityModifier = (score: number) => {
      const rem = (score - 10)
      const modifierScore = Math.floor(rem/2)
      return modifierScore
    }
  
    const attributePlusBtnClick = (index) => {
      const sum = attributesArr.reduce((acc, attr) => acc + attr.score, 0)
      if (sum < MAX_ATTRIBUTE_SUM) {
        const newAttributeArr = [...attributesArr]
        newAttributeArr[index].score = newAttributeArr[index].score + 1
        newAttributeArr[index].abilityModifier = computeAbilityModifier(newAttributeArr[index].score)
        setAttributesArr([...newAttributeArr])
      } else {
        alert('You exceeded maximum of 70 attributes, decrease one before you can increase')
      }
    }
  
    const attributeMinusBtnClick = (index: number) => {
      const newAttributeArr = [...attributesArr]
      newAttributeArr[index].score = newAttributeArr[index].score - 1
      newAttributeArr[index].abilityModifier = computeAbilityModifier(newAttributeArr[index].score)
      setAttributesArr([...newAttributeArr])
    }
  
    const showMinRequirement = (characterName: string) => {
      setMinRequirement({
        [characterName]: CLASS_LIST[characterName]
      })
    }
  
    const totalSkillPoints = () => {
      const intelligentModifier = attributesArr.find((attr) => attr.name === 'Intelligence')?.abilityModifier
      if (intelligentModifier < 0) return 0
      return 10 + (4 * intelligentModifier)
    }
  
    // Not enough time to integrate api calls
    // const saveData = async () => {
    //   const data = {
    //   }
    //   try {
    //     const res = await fetch('https://recruiting.verylongdomaintotestwith.ca/api/DivyaKundra/character', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(data),
    //     })
    //   } catch(e) {
  
    //   }
    // }
    const rollDice = () =>{
        const random =  Math.floor(Math.random() * 20) + 1;
        setDiceRoll(random)
        if(random + chosenSkill.score >= dc) {
            setResult('Success')
        } else {
            setResult('Failure')
        }
    }

    const updateSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChosenSkill({
            name: e.target.value,
            score: skillsArr.find((skill) => skill.name === e.target.value).total
        })
    }

    return (<>
    <h2>Character {charName}</h2>
    <div>
        <div className='container'>
            <h3>Skill Check Results</h3>
            <p> Skill: {chosenSkill.name} : {chosenSkill.score}</p>
            <p>You Rolled: {diceRoll}</p>
            <p>The DC was: {dc} </p>
            <p>Result: {result}</p>
        </div>
        <div className='container'>
        <h3>Skill Check</h3>
        <label> Skills </label>
        <select onChange={updateSkill}>
            <option key="-1"></option>
            {
                SKILL_LIST.map((skill, index) => <option key={index}>{skill.name}</option>)
            }
        </select>
        <label htmlFor="dc"> DC </label>
        <input type="number" id="dc" onChange={(e) => setDc(parseInt(e.target.value))}></input>
        <button onClick={rollDice}>Roll</button>
        </div>
      </div>
        <div className='container-wrapper'>
        <div className='container'>
        <h2>Attributes</h2>
        {
        attributesArr.map((attribute, index) => <div key={index}>
            <p>{attribute.name} : {attribute.score}  &#40; Modifier: {attribute.abilityModifier}  &#41;
            </p>
            <button onClick={() => attributeMinusBtnClick(index)}>-</button>
            <button onClick={() => attributePlusBtnClick(index)}>+</button>

        </div>)
        }
        </div>
        <div className='container'>
        <h3>Classes</h3>
        {
            classArr.map((character, index) => 
            <div key={index}>
            <p className={ character.isQualified === true ? 'red-color-text' : 'black-color-text'}
            onClick={() => showMinRequirement(character.name)}>{character.name}</p>
            <p>{character.isQualified} </p>
            </div>)
        }

        </div>
        { Object.keys(minRequirement).length > 0 && <div className='container'>
        <h3>Min Requirement for {Object.keys(minRequirement)[0]}</h3>
        <ul>
        {
        Object.entries(Object.values(minRequirement)[0]).map(([key, value]) => 
            <li key={key}>
            <p>{key} {value.toString()}</p>
            </li>
        )
        }
         </ul>
        <button onClick={() => setMinRequirement({})}>Close Min Requirements</button>
        </div>
        }
        <div className='container wider-box'>
        <h3>Skills</h3>
        <p className='skills-subheadline'>Total Skill points available are {totalSkillPoints()}</p>
        {
        skillsArr.map((skill, index) => <div key={index} className='flex-row'>
            <p>{skill.name}: {skill.spentScore} &#40; Modifier: {skill.attributeModifier}  &#41; :{skill.modifierScore}&nbsp;</p>
            <span><button onClick={() =>decreaseSkillScore(index)}>-</button></span>
            <span><button onClick={() =>increaseSkillScore(index)}>+</button></span>
            <p>&nbsp;total: {skill.total}</p>
            </div>
            )
        }
        </div>
        </div>
    </>)
}


export default CharacterSheet