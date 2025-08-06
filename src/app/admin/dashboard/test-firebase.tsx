'use client'

import React from 'react'
import { db } from '@/lib/firebase'

export default function TestFirebase() {
  return (
    <div>
      <h1>Firebase Test</h1>
      <p>Firebase DB: {db ? 'Connected' : 'Not Connected'}</p>
    </div>
  )
}
