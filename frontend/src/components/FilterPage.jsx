import React from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { useRestaurantStore } from '@/store/useRestaurantStore'

const filterOptions = [
  {
    id:"burger",
    label:"Burger"
  },
  {
    id:"thali",
    label:"Thali"
  },
  {
    id:"biryani",
    label:"Biryani"
  },
  {
    id:"momos",
    label:"Momos"
  },

]


function FilterPage() {
  const {setAppliedFilters, appliedFilter, resetAppliedFilter} = useRestaurantStore();
  const appliedFilterHandler = (value)=>{
    setAppliedFilters(value);
  }
  return (
    <div className='md:w-72'>
      <div className="flex items-center justify-between">
        <h1 className='font-medium text-lg'>Filter by cuisines</h1>
        <Button onClick={resetAppliedFilter} variant={'link'}>Reset</Button>
      </div>
      {
        filterOptions.map((option)=>(
          <div key={option.id} className="flex items-center space-x-2 my-5">
              <Checkbox  id={option.id} checked={appliedFilter.includes(option.label)} onClick={()=>appliedFilterHandler(option.label)} />
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option.label}</Label>
          </div>
        ))
      }
    </div>
  )
}

export default FilterPage