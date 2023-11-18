import { sample } from 'lodash'

export interface Model {
    readonly list: readonly string[]
    readonly answer: string
    readonly guesses: readonly string[]
}
export enum HintValue {
    BLACK = 'BLACK',
    YELLOW = 'YELLOW',
    GREEN = 'GREEN',
}
export interface Hint {
    readonly position: number
    readonly letter: string
    readonly value: HintValue
}

export function init(list: readonly string[]): Model {
    if (!list.length) throw new Error('empty wordlist')
    const answer = sample(list) as string
    const guesses: readonly string[] = []
    return { list, answer, guesses }
}
function listHints(answer: string, guesses: readonly string[]): readonly Hint[] {
    return guesses.flatMap(g => wordHints(answer, g))
}
export function wordHints(answer: string, guess: string): readonly Hint[] {
    // TODO yellows are wrong for double letters
    return guess.split('').map((letter, position) => {
        const value = letterHint(answer, letter, position)
        return { position, letter, value }
    })
}
function letterHint(answer: string, letter: string, position: number): HintValue {
    if (letter === answer.at(position)) return HintValue.GREEN
    return answer.indexOf(letter) < 0 ? HintValue.BLACK : HintValue.YELLOW
}
function narrow1(list: readonly string[], hint: Hint): readonly string[] {
    switch (hint.value) {
        case HintValue.BLACK: return list.filter(w => w.indexOf(hint.letter) < 0)
        case HintValue.GREEN: return list.filter(w => w.indexOf(hint.letter) === hint.position)
        case HintValue.YELLOW: return list.filter(w => {
            const x = w.indexOf(hint.letter)
            return x >= 0 && x !== hint.position
        })
    }
}
function narrowHints(list: readonly string[], hints: readonly Hint[]): readonly string[] {
    return hints.reduce((accum, hint) => narrow1(accum, hint), list)
}
function narrowGuesses(list: readonly string[], answer: string, guesses: readonly string[]): readonly string[] {
    return narrowHints(list, listHints(answer, guesses))
}
export function narrow(model: Model, guessIndex: number = model.guesses.length): readonly string[] {
    return narrowGuesses(model.list, model.answer, model.guesses.slice(0, guessIndex))
}
function nextGuess(model: Model): string {
    const list = narrow(model)
    if (!list.length) throw new Error('guesslist is empty')
    return sample(list) as string
}
export function guess(model: Model): Model {
    const g = nextGuess(model)
    return { ...model, guesses: [...model.guesses, g] }
}
export function isWin(model: Model): boolean {
    return model.answer === model.guesses[model.guesses.length - 1]
}
export function guessUntilDone(model: Model): Model {
    while (!isWin(model) && model.guesses.length < 6) {
        model = guess(model)
    }
    return model
}