const options = ['prices', 'positions']

const ChartControl = ({ view, handleSetView }) => {
  return (
    <section>
      <select onChange={handleSetView} value={view} name="view" id="view">
        {options.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </section>
  )
}

export { ChartControl }
