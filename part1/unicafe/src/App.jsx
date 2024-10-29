import { useState } from 'react'

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (<table>
    <tbody>

      <Statisticline text="good" value={props.good} />
      <Statisticline text="neutral" value={props.neutral} />
      <Statisticline text="bad" value={props.bad} />
      <Statisticline text="all" value={props.total} />
      <Statisticline text="average" value={props.average} />
      <Statisticline text="positive" value={props.positive + " %"} />
    </tbody>
  </table>
  )
}
const Statisticline = (props) => {
  return (
    <tr>
      <td>
        {props.text} {props.value}
      </td>
    </tr>
  )
}
const Button = (props) => {
  return (

    <button onClick={props.onClick}>{props.label}</button>

  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = (good - bad) / total
  let positive = 0
  if (good > 0) {
    positive = (good / total) * 100
  }
  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} label="good" />
      <Button onClick={() => setNeutral(neutral + 1)} label="neutral" />
      <Button onClick={() => setBad(bad + 1)} label="bad" />
      <h1>statistics</h1>
      <Statistics good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive} />
    </div>
  )
}

export default App