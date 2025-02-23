import { useCallback, useMemo, useState } from 'react';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../consts';
import { computeAbilityModifier } from '../util';
const MAX_ATTRIBUTE_SUM = 70

const CharacterSheet = ({ charName }) => {
  const setInitialState = () => {
    return {
      attributes: ATTRIBUTE_LIST.map((attributeName) => ({
        name: attributeName,
        score: 0,
        abilityModifier: 0
      })),

      classArr: Object.keys(CLASS_LIST).map((characterName) => ({
        name: characterName,
        isQualified: false
      })),

      skills: SKILL_LIST.map(skill => ({
        name: skill.name,
        attributeModifier: skill.attributeModifier,
        spentScore: 0,
        total: 0,
        modifierScore: 0
      }))
    }
  }
  const setInitialSkillCheck = () => {
    return {
      choosenSkill: '',
      skillScore: 0,
      diceRoll: 0,
      dc: 0,
      result: 'failure'
    }
  }
  const [state, setState] = useState(setInitialState())
  const [minRequirement, setMinRequirement] = useState({})
  const [skillCheck, setSkillCheck] = useState(setInitialSkillCheck)

  const increaseSkillScore = (index: number) => {
    const sum = state.skills.reduce((acc, skill) => acc + skill.spentScore, 0)

    if (sum < totalSkillPoints) {
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

  const attributePlusBtnClick = (index: number) => {
    const sum = state.attributes.reduce((acc, attr) => acc + attr.score, 0)

    if (sum < MAX_ATTRIBUTE_SUM) {
      setState((prev) => {
        const newAttributes = prev.attributes.map((attribute, i) => {
          if (i === index) {
            return {
              ...attribute, score: attribute.score + 1,
              abilityModifier: computeAbilityModifier(attribute.score + 1)
            }
          } else {
            return attribute
          }
        })

        //update newClassArr
        const newClassArr = prev.classArr.map((classObj) => {
          const isQualified = Object.entries(CLASS_LIST[classObj.name]).every(
            ([attribute, requiredScore]) => {
              const findAttr = newAttributes.find((att) => att.name === attribute);
              return findAttr && findAttr.score >= requiredScore;
            }
          );
          return { ...classObj, isQualified };
        });

        // Update skills
        const newSkills = prev.skills.map((skill) => {
          const attribute = newAttributes.find((attr) => attr.name === skill.attributeModifier);
          const modifierScore = attribute ? attribute.abilityModifier : 0;
          return { ...skill, modifierScore, total: skill.spentScore + modifierScore };
        });

        return { ...prev, attributes: newAttributes, classArr: newClassArr, skills: newSkills }

      })
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

  const totalSkillPoints: number = useMemo<number>(() => {
    const intelligenceAttr = state.attributes?.find((attr) => attr.name === 'Intelligence') || { abilityModifier: 0 };
    const intelligentModifier: number = intelligenceAttr.abilityModifier ?? 0;
    return intelligentModifier < 0 ? 10 : 10 + 4 * intelligentModifier;
  }, [state.attributes]);

  const rollDice = useCallback(() => {
    const random = Math.floor(Math.random() * 20) + 1;
    setSkillCheck((prev) => (
      {
        ...prev,
        diceRoll: random,
        result: random + prev.skillScore >= prev.dc ? 'Success' : 'Failure'
      }))

  }, [skillCheck])

  const updateSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSkillCheck((prev) => (
      {
        ...prev,
        skillScore: state.skills.find((skill) => skill.name === e.target.value).total,
        choosenSkill: e.target.value,
      }))
  }

  return (<div data-testid="character-sheet">
    <h2>Character {charName}</h2>
    <div>
      <div className='container'>
        <h3>Skill Check Results</h3>
        <p> Skill: {skillCheck.choosenSkill} : {skillCheck.skillScore}</p>
        <p>You Rolled: {skillCheck.diceRoll}</p>
        <p>The DC was: {skillCheck.dc} </p>
        <p>Result: {skillCheck.result}</p>
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
        <input type="number" id="dc"
          onChange={(e) => setSkillCheck(prev => ({
            ...prev,
            dc: parseInt(e.target.value)
          }))}>

        </input>
        <button onClick={rollDice}>Roll</button>
      </div>
    </div>
    <div className='container-wrapper'>
      <div className='container'>
        <h2>Attributes</h2>
        {
          state.attributes.length && state.attributes.map((attribute, index) => <div key={index}>
            <p> <span data-testid={`attribute-${attribute.name}`}>{attribute.name}</span> : <span data-testid={`attribute-score-for-${attribute.name}`}>{attribute.score} </span> &#40; Modifier: <span data-testid={`attribute-modifier-for-${attribute.name}`}>{attribute.abilityModifier}</span>  &#41;
            </p>
            <button data-testid={`subtract-attribute-btn-${attribute.name}`} onClick={() => attributeMinusBtnClick(index)}>-</button>
            <button data-testid={`add-attribute-btn-${attribute.name}`} onClick={() => attributePlusBtnClick(index)}>+</button>
          </div>)
        }
      </div>
      <div className='container'>
        <h3>Classes</h3>
        {
          state.classArr.map((character, index) =>
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
        <p className='skills-subheadline'>Total Skill points available are {totalSkillPoints}</p>
        {
          state.skills.map((skill, index) => <div key={index} className='flex-row'>
            <p>{skill.name}: {skill.spentScore} &#40; Modifier:  <span data-testid={`skill-modifier-name-${skill.attributeModifier}`}>{skill.attributeModifier} </span>&#41; : <span data-testid={`skill-modifier-score-${skill.attributeModifier}`}>{skill.modifierScore}&nbsp;</span></p>
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