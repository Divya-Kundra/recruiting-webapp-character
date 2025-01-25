import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';


function App() {
  const [attributesArr, setAttributesArr] = useState([])
  const [classArr, setClassArr] = useState([])
  const [minRequirement, setMinRequirement] = useState({})
  const [skillsArr, setSkillsArr] = useState([])

  useEffect(() => {
    const initialAttributeArray = []
    for(let i=0; i<ATTRIBUTE_LIST.length; i++) {
      initialAttributeArray.push({
        name: ATTRIBUTE_LIST[i],
        score: 0,
        abilityModifier: computeAbilityModifier(0)
      })
    }
    console.log('attributes array is', initialAttributeArray)
    setAttributesArr([...initialAttributeArray])
  }, [])

  useEffect(() => {
    const initialClassArr = []
    for(let character in CLASS_LIST) {
      initialClassArr.push({
        name: character,
        isQualified: false
      })
    }
    console.log('initial class arr', initialClassArr)
    setClassArr([...initialClassArr])

  },[])


  useEffect(() => {
    const initialSkillsArr = []
    for(let i=0; i<SKILL_LIST.length; i++) {
      console.log('TESTING',attributesArr.find((attr) => attr.name === SKILL_LIST[i].attributeModifier))
      initialSkillsArr.push({
        name: SKILL_LIST[i].name,
        attributeModifier: SKILL_LIST[i].attributeModifier,
        spentScore: 0,
        total: 0,
        modifierScore: attributesArr.find((attr) => attr.name === SKILL_LIST[i].attributeModifier)?.abilityModifier
      })
    }
    console.log('initial skill arr', initialSkillsArr)
    setSkillsArr([...initialSkillsArr])
  }, [])

  useEffect(() => {
    if (attributesArr.length) {
      // check if any class becomes active
    for(let character in CLASS_LIST) {
      let isQualified=  true
      // check if all of its attributes are above the current score
      for(let characterAttribute in CLASS_LIST[character]) {
        const score = CLASS_LIST[character][characterAttribute]
        // find corresponding attribute in the attribute arr
        const requiredAttribute = attributesArr.find((att) => att.name === characterAttribute)
        if (score > requiredAttribute.score) {
          isQualified = false
          break;
        }
      }
      const newCharClass = [...classArr]
      const requiredChar = classArr.find((char) => char.name === character)
      if(isQualified){
        requiredChar.isQualified = true
        setClassArr([...newCharClass])
      } else {
        requiredChar.isQualified = false
        setClassArr([...newCharClass])
      }
    }

    // set modifier score in skills array 
    const newSkillsArr = [...skillsArr]
    for(let i=0; i<SKILL_LIST.length; i++) {
      // find corresponding attribute
      const attr = attributesArr.find((attr) => attr.name === SKILL_LIST[i].attributeModifier)
      newSkillsArr[i].modifierScore = attr.abilityModifier
      newSkillsArr[i].total = newSkillsArr[i].spentScore + newSkillsArr[i].modifierScore
    }
    setSkillsArr([...newSkillsArr])


    }
  }, [attributesArr])


  const increaseSkillScore = (index) =>{
    const newSkills = [...skillsArr]
      // check if sum of all spendscores is less than equal to total skill points otherwise show error
      const sum = skillsArr.reduce((acc, skill) => acc + skill.spentScore, 0)
      console.log('sum is', sum, totalSkillPoints()) 
      // sum should be 1 greater 
      if (sum < totalSkillPoints()) {
        newSkills[index].spentScore = newSkills[index].spentScore + 1
        newSkills[index].total = newSkills[index].spentScore + newSkills[index].modifierScore
        console.log('newSkills total', newSkills[index].total)
        setSkillsArr([...newSkills])
      } else {
      alert('You need more skill points ! Upgrade your intelligence to get more')
    }
  }

  const decreaseSkillScore = (index) =>{
    const newSkills = [...skillsArr]
    newSkills[index].spentScore = newSkills[index].spentScore - 1
    newSkills[index].total = newSkills[index].spentScore + newSkills[index].modifierScore
    setSkillsArr([...newSkills])
  }


  const computeAbilityModifier = (score) => {
    const rem = (score - 10)
    const modifierScore = Math.floor(rem/2)
    return modifierScore
  }

  const attributePlusBtnClick = (index) => {
    const newAttributeArr = [...attributesArr]
    newAttributeArr[index].score = newAttributeArr[index].score + 1
    newAttributeArr[index].abilityModifier = computeAbilityModifier(newAttributeArr[index].score)
    setAttributesArr([...newAttributeArr])
  }

  const attributeMinusBtnClick = ( index) => {
    const newAttributeArr = [...attributesArr]
    newAttributeArr[index].score = newAttributeArr[index].score - 1
    newAttributeArr[index].abilityModifier = computeAbilityModifier(newAttributeArr[index].score)
    setAttributesArr([...newAttributeArr])
  }

  const showMinRequirement = (characterName: string) => {
    console.log('character is', characterName, CLASS_LIST[characterName])
    setMinRequirement(CLASS_LIST[characterName])
  }

  const totalSkillPoints = () => {
    const intelligentModifier = attributesArr.find((attr) => attr.name === 'Intelligence')?.abilityModifier
    if (intelligentModifier < 0) return 0
    return 10 + (4 * intelligentModifier)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
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
        { Object.keys(minRequirement).length> 1 && <div className='container'>
          <h3>Min Requirement for</h3>
        {
          Object.entries(minRequirement).map(([key, value]) => 
            <ul>
            <li key={key}>
               <p>{key} {value.toString()}</p>
            </li>
            </ul>
          )

        }
        <button onClick={() => setMinRequirement({})}>Close Min Requirements</button>
        </div>
      }
      <div className='container wider-box'>
        <h3>Skills</h3>
        <p className='skills-subheadline'>Total Skill points available are {totalSkillPoints()}</p>
        {
          skillsArr.map((skill, index) => <div key={index} className='flex-row'>
              <p>{skill.name}: {skill.spentScore} &#40; Modifier: {skill.attributeModifier}  &#41; : {skill.modifierScore}&nbsp; </p>
              <span><button onClick={() =>decreaseSkillScore(index)}>-</button></span>
              <span><button onClick={() =>increaseSkillScore(index)}>+</button></span>
              <p>&nbsp;total: {skill.total}</p>
            </div>
            )
        }
      </div>
      </div>
      </section>
    </div>
  );
}

export default App;
