import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';


function App() {
  const [attributesArr, setAttributesArr] = useState([])
  const [classArr, setClassArr] = useState([])
  const [minRequirement, setMinRequirement] = useState({})

  useEffect(() => {
    const initialAttributeArray = []
    for(let i=0; i<ATTRIBUTE_LIST.length; i++) {
      initialAttributeArray.push({
        name: ATTRIBUTE_LIST[i],
        score: 0
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
    // check if any of the class match changed attribute scores
    if (attributesArr.length) {
    for(let character in CLASS_LIST) {
      let isQualified=  true
      // check if all of its attributes are above the current score
      for(let characterAttribute in CLASS_LIST[character]) {
        const score = CLASS_LIST[character][characterAttribute]
        // find corresponding attribute in the attribute arr
        const requiredAttribute = attributesArr.find((att) => att.name === characterAttribute)
        // console.log('required Attribute', requiredAttribute)
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
    }
  }, [attributesArr])

  const attributePlusBtnClick = (index) => {
    const newAttributeArr = [...attributesArr]
    newAttributeArr[index].score = newAttributeArr[index].score + 1
    setAttributesArr([...newAttributeArr])
  }

  const attributeMinusBtnClick = ( index) => {
    const newAttributeArr = [...attributesArr]
    newAttributeArr[index].score = newAttributeArr[index].score - 1
    setAttributesArr([...newAttributeArr])
  }

  const showMinRequirement = (characterName: string) => {
    console.log('character is', characterName, CLASS_LIST[characterName])
    setMinRequirement(CLASS_LIST[characterName])
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
            <p>{attribute.name} : {attribute.score}</p>
            <button onClick={() => attributeMinusBtnClick(index)}>-</button>
            <button onClick={() => attributePlusBtnClick(index)}>+</button>

          </div>)
        }
        </div>
        <div className='container'>
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
      </div>
      </section>
    </div>
  );
}

export default App;
