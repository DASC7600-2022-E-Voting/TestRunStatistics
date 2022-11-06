const fs = require('fs');

function getMean (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return mean
}

function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

fs.readFile('data/test_log2.jsonl', 'utf-8', (err, data) => {
    const lines = data.split('\n')
    const runs = lines.map(line => JSON.parse(line))
    
    const all0 = runs.filter(run => run.params[0] === 1)
    const all1 = runs.filter(run => run.params[0] === 0)

    const all0castingSteps = all0.map(run => 
        run.steps.find(step => step.name === 'Cast valid encrypted votes')
    )
    const all1castingSteps = all1.map(run => 
        run.steps.find(step => step.name === 'Cast valid encrypted votes')
    )

    const all0costs = all0castingSteps.map(step => step.cost)
    const all1costs = all1castingSteps.map(step => step.cost)

    const all0durations = all0castingSteps.map(step => step.duration)
    const all1durations = all1castingSteps.map(step => step.duration)

    let log = ''
    log += `All 0 costs: ${all0costs}\n`
    log += `All 1 costs: ${all1costs}\n`
    log += `All 0 durations: ${all0durations}\n`
    log += `All 1 durations: ${all1durations}\n`
    log += (`-----------------------------------\n`)
    log += (`All 0 costs avg: ${getMean(all0costs)}\n`)
    log += (`All 1 costs avg: ${getMean(all1costs)}\n`)
    log += (`% Diff: ${((1 - getMean(all0costs) / getMean(all1costs)) * 100).toFixed(2)}%\n`)
    log += (`All 0 costs sd: ${getStandardDeviation(all0costs)}\n`)
    log += (`All 1 costs sd: ${getStandardDeviation(all1costs)}\n`)
    log += (`% Diff: ${((1 - getStandardDeviation(all0costs) / getStandardDeviation(all1costs)) * 100).toFixed(2)}%\n`)
    log += (`-----------------------------------\n`)
    log += (`All 0 duration avg: ${getMean(all0durations)}\n`)
    log += (`All 1 duration avg: ${getMean(all1durations)}\n`)
    log += (`% Diff: ${((1 - getMean(all0durations) / getMean(all1durations)) * 100).toFixed(2)}%\n`)
    log += (`All 0 duration sd: ${getStandardDeviation(all0durations)}\n`)
    log += (`All 1 duration sd: ${getStandardDeviation(all1durations)}\n`)
    log += (`% Diff: ${((1 - getStandardDeviation(all0durations) / getStandardDeviation(all1durations)) * 100).toFixed(2)}%\n`)
    log += (`-----------------------------------\n`)
    
    fs.writeFileSync('result2.txt', log)
})