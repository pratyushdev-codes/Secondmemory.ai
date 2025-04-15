import React from 'react'

const Chathistory = () => {
  return (
    <div className="flex flex-col h-full ">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold text-gray-200">Chat Assistant</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-4 chat-scrollbar scrollbar-invisible">
     
    </div>

  </div>
  )
}

export default Chathistory