
const Header = (props) => {
    return (
      <div>
        <h1>{props.course.name}</h1>
      </div>
    )
  }
  const Part = (props) => {
    return (
      <div>
        {props.parts.map((part) => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
      </div>
    );
  }
  const Content = (props) => {
    return (<div>
      <Part parts={props.course.parts} />
    </div>)
  }
  const Total = (props) => {
    const total = props.course.parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
  
    return (<div> <b> <p>total of {total} exercises</p></b></div>)
  }
  
  const Course = (props) => {
    return (
      <div>
        {props.courses.map((course) => (
          <div key={course.id}>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
          </div>
        ))}
      </div>
    )
  }

  export default Course;