'use client'

import { useState } from 'react'

import { ExpandingTextArea } from 'ui'

import { withDisplayForSupabaseOnly } from '../tooling.auth.client'

function ToolingPage() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Main />
    </main>
  )
}

export default withDisplayForSupabaseOnly(ToolingPage)

function Main() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="w-full h-full p-12 grid grid-cols-2 gap-20">
      <div className="min-h-0 h-full flex flex-col gap-2">
        <label htmlFor="prompt">Write a summary of the content you want to add:</label>
        <div className="min-h-0 flex-grow">
          <ExpandingTextArea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.currentTarget.value)}
            className="max-h-full"
          />
        </div>
      </div>
    </div>
  )
}
