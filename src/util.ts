const computeAbilityModifier = (score: number) => {
    console.log('compute ability modifier')
    const rem = (score - 10)
    const modifierScore = Math.floor(rem / 2)
    return modifierScore
}

export {
    computeAbilityModifier
}