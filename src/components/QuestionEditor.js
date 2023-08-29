import React from 'react'
import Tree from "./tree";
import { DEFAULT_NODES } from "../constants";
import '../App.css'

export default function QuestionEditor() {
  return (
    <div>
      <h2 className='text-dark'>Question Editor</h2>
    <Tree data={DEFAULT_NODES}/>
    </div>
  )
}
