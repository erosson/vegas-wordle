import * as M from './model.js'

export interface Stats {
    readonly wins: readonly number[]
    readonly losses: number
}

export function init(): Stats {
    const wins = [0, 0, 0, 0, 0, 0]
    const losses = 0
    return { wins, losses }
}
export function push(stats: Stats, model: M.Model): Stats {
    if (M.isWin(model) && model.guesses.length <= stats.wins.length) {
        const wins = [...stats.wins]
        wins[model.guesses.length - 1] += 1
        return { ...stats, wins }
    }
    return { ...stats, losses: stats.losses + 1 }
}