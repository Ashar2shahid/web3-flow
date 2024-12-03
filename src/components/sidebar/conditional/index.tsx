
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form';

import { conditionData } from '@/data/condition';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/ui/Icons';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';


const ConditionalForm = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "condition_data.or",
  });

  const { fields:andFields, append:andAppend, remove:andRemove } = useFieldArray({
    control: control,
    name: "condition_data.and",
  });
     return (
      <div>
                    <Card className=" w-full px-3 py-3 flex flex-col gap-5">
                <div className="flex flex-col gap-5">
                  {fields.map((item: any & { id: string }, index: number) => (
                    <div
                      className=" "
                      key={item.id}
                    >
                      <div className="flex  justify-end mb-5">
                        <button
                          onClick={() => {
                            remove(index);
                          }}
                          type="button"
                          className="text-sm text-black hover:bg-gray-200 p-1 rounded-md transition-all  duration-500 focus:outline-none sm:mt-4 sm:col-span-1 self-end"
                        >
                          <Icons.trash size={20} />
                          <span className="sr-only">remove</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        <FormField
                          control={control}
                          name={
                            `condition_data.or.${index}.contidion_type` as const
                          }
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={watch(
                                    `condition_data.or.${index}.contidion_type`
                                  )}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a condition" />
                                  </SelectTrigger>

                                  <SelectContent className="" align="end">
                                    {conditionData.map((item, index) => (
                                      <SelectItem
                                        key={index}
                                        value={item.id}
                                        defaultChecked
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        {watch(`condition_data.or.${index}.contidion_type`) ==
                          "1" && (
                          <div className="flex flex-col gap-4">
                            <div className="space-y-1 ">
                            <FormField
                          control={control}
                          name={
                            `condition_data.or.${index}.contidion_type` as const
                          }
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={watch(
                                    `condition_data.or.${index}.contidion_type`
                                  )}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a condition" />
                                  </SelectTrigger>

                                  <SelectContent className="" align="end">
                                    {conditionData.map((item, index) => (
                                      <SelectItem
                                        key={index}
                                        value={item.id}
                                        defaultChecked
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        contidion_type: "",
                        person_has: {},
                        dimention: {},
                        location:{}

                      })
                    }
                    className="w-full sm:w-auto bg-transparent text-black font-semibold hover:bg-gray-300 self-start border border-black"
                  >

                    OR
                  </Button>
                </div>
              </Card>
    </div>
  )
}

export default ConditionalForm