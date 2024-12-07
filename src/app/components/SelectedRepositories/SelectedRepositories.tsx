import React from 'react'

const SelectedRepositories = ({selectedRepos, setSelectedRepos, setAddedRepos, addedRepos}) => {


    

  const handleRemoveRepo = (nameofrepo) => {
    // Remove repo from selected and added lists
    setSelectedRepos(selectedRepos.filter((repo) => repo !== nameofrepo));
    setAddedRepos(addedRepos.filter((repo) => repo !== nameofrepo));
  };


  return (
      <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 border-2 p-1 border-black rounded-sm overflow-auto">
        <h1 className="font-semibold py-3 text-2xl flex justify-center">
          SELECTED REPOSITORIES
        </h1>

        {selectedRepos.map((name, index) => (
          <div
            className="bg-gray-400 px-2 py-1 flex justify-between mb-1 border-2 border-black rounded-sm"
            key={index}
          >
            {name}

            <button
              className="bg-red-500 border-[1px] border-black rounded-sm px-2 py-[1px]"
              onClick={() => handleRemoveRepo(name)}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  )
}

export default SelectedRepositories
