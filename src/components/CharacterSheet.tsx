import { useEffect, useState } from 'react';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../consts';

const CharacterSheet = ({ charName }) => {
  const MAX_ATTRIBUTE_SUM = 70
  type CharacterState = {
    attributes: Array<{
      name: string;
      score: number;
      abilityModifier: number;
    }>;
    classArr: Array<{
      name: string;
      isQualified: boolean;
    }>;
    skills: Array<{
      name: string;
      attributeModifier: string;
      spentScore: number;
      total: number;
      modifierScore: number;
    }>;
  };
  const setInitialState = () => {
    const stateObj: {
      attributes: Array<{
        name: string,
        score: number,
        abilityModifier: number
      }>,
      classArr: Array<{
        name: string,
        isQualified: boolean
      }>,
      skills: Array<{
        name: string,
        attributeModifier: string,
        spentScore: number,
        total: number,
        modifierScore: number
      }>
    } = {
      attributes: [],
      classArr: [],
      skills: []
    }

    const initialAttributeArray: Array<{
      name: string,
      score: number,
      abilityModifier: number
    }> = []

    for (let i = 0; i < ATTRIBUTE_LIST.length; i++) {
      initialAttributeArray.push({
        name: ATTRIBUTE_LIST[i],
        score: 0,
        abilityModifier: 0
      })
    }

    stateObj.attributes = initialAttributeArray


    const initialClassArr: Array<{
      name: string,
      isQualified: boolean
    }> = []

    for (let character in CLASS_LIST) {
      initialClassArr.push({
        name: character,
        isQualified: false
      })
    }
    stateObj.classArr = initialClassArr


    const initialSkillsArr: Array<{
      name: string,
      attributeModifier: string,
      spentScore: number,
      total: number,
      modifierScore: number
    }> = []
    for (let i = 0; i < SKILL_LIST.length; i++) {
      initialSkillsArr.push({
        name: SKILL_LIST[i].name,
        attributeModifier: SKILL_LIST[i].attributeModifier,
        spentScore: 0,
        total: 0,
        modifierScore: initialAttributeArray.find((attr) => attr.name === SKILL_LIST[i].attributeModifier)?.abilityModifier
      })
    }

    stateObj.skills = initialSkillsArr
    return stateObj
  }

  const [state, setState] = useState(setInitialState())
  const [minRequirement, setMinRequirement] = useState({})
  const [chosenSkill, setChosenSkill] = useState({
    name: '',
    score: 0
  })
  const [diceRoll, setDiceRoll] = useState(0)
  const [dc, setDc] = useState(0)
  const [result, setResult] = useState('failure')

  const increaseSkillScore = (index: number) => {
    const sum = state.skills.reduce((acc, skill) => acc + skill.spentScore, 0)
    if (sum < totalSkillPoints()) {
      setState((prev) => ({
        ...prev,
        skills: prev.skills.map((skill, i) => {
          if (i === index) {
            return {
              ...skill, spentScore: skill.spentScore + 1, total: skill.spentScore + 1 + skill.modifierScore
            }
          } else {
            return { ...skill }
          }
        })
      }))

    } else {
      alert('You need more skill points ! Upgrade your intelligence to get more')
    }
  }

  const decreaseSkillScore = (index: number) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => {
        if (i === index) {
          return {
            ...skill, spentScore: skill.spentScore - 1, total: skill.spentScore - 1 + skill.modifierScore
          }
        } else {
          return { ...skill }
        }
      })
    }))
  }


  const computeAbilityModifier = (score: number) => {
    const rem = (score - 10)
    const modifierScore = Math.floor(rem / 2)
    return modifierScore
  }

  const attributePlusBtnClick = (index: number) => {
    const sum = state.attributes.reduce((acc, attr) => acc + attr.score, 0)

    if (sum < MAX_ATTRIBUTE_SUM) {
      // update attribute value
      setState((prev) => ({
        ...prev,
        attributes: state.attributes.map((attribute, i) => {
          if (i === index) {
            return {
              ...attribute, score: attribute.score + 1,
              abilityModifier: computeAbilityModifier(attribute.score + 1)
            }
          } else {
            return attribute
          }
        })
      }))

      // check qualified class
      setState((prev) => ({
        ...prev,
        classArr: prev.classArr.map((classObj) => {
          const isQualified = Object.entries(CLASS_LIST[classObj.name]).every(([attribute, requiredScore]) => {
            const findAttr = prev.attributes.find((att) => att.name === attribute);
            return findAttr && findAttr.score >= requiredScore
          });
          return { ...classObj, isQualified };
        })
      }))

      // update skill
      setState((prev) => ({
        ...prev,
        skills: prev.skills.map((skill) => {
          const attribute = prev.attributes.find((attr) => attr.name === skill.attributeModifier)
          const modifierScore = attribute ? attribute.abilityModifier : 0
          return {
            ...skill,
            modifierScore,
            total: skill.spentScore + modifierScore
          }
        })
      }))
    } else {
      alert('You exceeded maximum of 70 attributes, decrease one before you can increase')
    }
  }

  const attributeMinusBtnClick = (index: number) => {
    //update attribute value
    setState((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attribute, i) => {
        if (i === index) {
          return { ...attribute, score: attribute.score - 1, abilityModifier: computeAbilityModifier(attribute.score - 1) }
        } else {
          return attribute
        }
      })
    }))

    //update class value
    setState((prev) => ({
      ...prev,
      classArr: prev.classArr.map((classObj) => {
        const isQualified = Object.entries(CLASS_LIST[classObj.name]).every(([attribute, requiredScore]) => {
          const findAttr = prev.attributes.find((att) => att.name === attribute);
          return findAttr && findAttr.score >= requiredScore
        });
        return { ...classObj, isQualified };
      })
    }))

    //update skill value
    setState((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => {
        const attribute = prev.attributes.find((attr) => attr.name === skill.attributeModifier)
        const modifierScore = attribute ? attribute.abilityModifier : 0
        return {
          ...skill,
          modifierScore,
          total: skill.spentScore + modifierScore
        }
      })
    }))
  }

  const showMinRequirement = (characterName: string) => {
    setMinRequirement({
      [characterName]: CLASS_LIST[characterName]
    })
  }

  const totalSkillPoints = () => {
    const intelligentModifier = state.attributes.find((attr) => attr.name === 'Intelligence')?.abilityModifier
    if (intelligentModifier < 0) return 10
    return 10 + (4 * intelligentModifier)
  }

  const rollDice = () => {
    const random = Math.floor(Math.random() * 20) + 1;
    setDiceRoll(random)
    if (random + chosenSkill.score >= dc) {
      setResult('Success')
    } else {
      setResult('Failure')
    }
  }

  const updateSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChosenSkill({
      name: e.target.value,
      score: state.skills.find((skill) => skill.name === e.target.value).total
    })
  }

  return (<div data-testid="character-sheet">
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
          state.attributes.length && state.attributes.map((attribute, index) => <div key={index}>
            <p> <span data-testid={`attribute-${attribute.name}`}>{attribute.name}</span> : <span data-testid={`attribute-score-${index}`}>{attribute.score} </span> &#40; Modifier: <span data-testid={`attribute-modifier-${index}`}>{attribute.abilityModifier}</span>  &#41;
            </p>
            <button data-testid={`subtract-attribute-${index}`} onClick={() => attributeMinusBtnClick(index)}>-</button>
            <button data-testid={`add-attribute-${index}`} onClick={() => attributePlusBtnClick(index)}>+</button>
          </div>)
        }
      </div>
      <div className='container'>
        <h3>Classes</h3>
        {
          state.classArr.length && state.classArr.map((character, index) =>
            <div key={index}>
              <p className={character.isQualified === true ? 'red-color-text' : 'black-color-text'}
                onClick={() => showMinRequirement(character.name)}>{character.name}</p>
              <p>{character.isQualified} </p>
            </div>)
        }

      </div>
      {Object.keys(minRequirement).length > 0 && <div className='container'>
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
          state.skills.length && state.skills.map((skill, index) => <div key={index} className='flex-row'>
            <p>{skill.name}: {skill.spentScore} &#40; Modifier:  <span data-testid={`skill-modifier-name-${skill.attributeModifier}`}>{skill.attributeModifier} </span>&#41; : <span data-testid={`skill-modifier-value-${index}`}>{skill.modifierScore}&nbsp;</span></p>
            <span><button onClick={() => decreaseSkillScore(index)}>-</button></span>
            <span><button onClick={() => increaseSkillScore(index)}>+</button></span>
            <p>&nbsp;total: {skill.total}</p>
          </div>
          )
        }
      </div>
    </div>
  </div >)
}


export default CharacterSheet