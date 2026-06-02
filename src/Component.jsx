import React, { useState } from 'react'

export default function Component() {

  const [text, setText] = useState("")
  const[updated,setUpdated] = useState("")

  const textOnChange = (event) => {
    setText(event.target.value)
  }

  const buttonOnClick = () => {
    setUpdated(text)
  }
  
  return (
    <div> 
      <input type="text" value={text} onChange={textOnChange} />
      <button onClick={buttonOnClick}>Actualizar estado</button>
      <p>Texto a ingresar: {text}</p>
      <p>Texto actualizado: {updated}</p>
    </div>
  )
}
