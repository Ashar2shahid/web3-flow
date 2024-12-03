"use client"
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Combobox, ScrollArea, TextInput, useCombobox } from '@mantine/core';
import { PlusCircledIcon } from "@radix-ui/react-icons";


const renderedItems = [
  {
    name: "First Name",
    variable: "{{First name}}",
  },
  {
    name: "Last Name",
    variable: "{{Last name}}",
  },
  {
    name: "Headline",
    variable: "{{Headline}}",
  },
  {
    name: "Biography",
    variable: "{{Biography}}",
  },
  {
    name: "Work experience",
    variable: "{{Work experience}}",
  },
  {
    name: "Company name",
    variable: "{{Company name}}",
  },
  {
    name: "Company overview",
    variable: "{{Company Overview}}",
  },
  {
    name: "Company url",
    variable: "{{Company Url}}",
  },
  {
    name: "Last post",
    variable: "{{Last post}}",
  },
  {
    name: "Last repost",
    variable: "{{Last repost}}",
  },
  {
    name: "Username",
    variable: "{{Username}}",
  },
  {
    name: "My value proposition",
    variable: "{{My value proposition}}",
  },
];

const SideVariable = ({ addVariable }: any) => {
  const [open,setOpen]=useState(false)
  const [value, setValue] = useState('');
  const combobox = useCombobox();
  const shouldFilterOptions = !renderedItems.some((item) => item.variable.trim() === value.trim());
  const filteredOptions = shouldFilterOptions
    ? renderedItems.filter((item) => item.variable.includes(value.toLowerCase().trim()))
    : renderedItems;

  const options = filteredOptions.map((item,index) => (
    <Combobox.Option value={item.variable.trim()} key={index} className="">
      {item.name}
    </Combobox.Option>
  ));
  return (
    <div className="flex items-center space-x-4 relative z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button">
            <div className="text-[#6039DB] gap-2 flex rounded justify-start items-center px-3 py-1 border border-gray-400  ">
              <PlusCircledIcon className="h-5 w-5" />
              <span className="text-black">Variables</span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full overflow-hidden h-80 " align="start">
      <Combobox
      onOptionSubmit={(optionValue) => {
        addVariable(optionValue)
        combobox.closeDropdown();
        setOpen(false)
      }}
      store={combobox}
      
    >
      <Combobox.Target >
        <TextInput
          label="Pick value or type anything"
          placeholder="Pick value or type anything"
          className="overflow-hidden"
          value={value.trim()}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown className="h-56">
        <Combobox.Options>
        <ScrollArea.Autosize type="scroll" mah={200}>
          {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
    </PopoverContent>
  </Popover>
    </div>
  );
};

export default SideVariable;


 
