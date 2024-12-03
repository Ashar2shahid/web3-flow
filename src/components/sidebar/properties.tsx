import { cn } from '@/lib/utils';
import { usePropertyStore } from '@/store/usePropertyStore';
import { QueryBuilder } from 'react-querybuilder';
import { useNodeDataChange } from '@/hooks/useUpdateNode';
import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Button } from '../ui/button';

import {
  CommonCondition,
  EmailNodeData,
  MessageNodeData,
  NotificaionNodeData,
  TimeDelayNodeData,
  UserProfileNodeData,
  WebhookData,
  propertyData,
} from '@/data/NodeData';
import { NodeType } from '@/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { Icons } from '../ui/Icons';
import { Card } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import SideVariable from './sideVariable';

import { conditionfields,  operators } from '@/data/condition';
import { QueryBuilderShadcnUi } from './condition';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getTileColor } from '../layouts';

export interface FormValues {
  sms_data?: MessageNodeData;
  email_data?: EmailNodeData;
  delay_data?: TimeDelayNodeData;
  condition_data?: CommonCondition;
  profile_data?: UserProfileNodeData;
  notification_data?: NotificaionNodeData;
  webhook_data?: WebhookData;
  description?: string;
}
const propertyOptions = [
  {
    id: '1',
    label: 'Update existing property',
  },
  {
    id: '2',
    label: 'Create new property',
  },
  {
    id: '3',
    label: 'Delete existing property',
  },
];

const defaultValues = {};
export const Properties = () => {
  const { showProperty, properties, setProperties, setShowProperty } =
    usePropertyStore();
  const [query, setQuery] = useState<CommonCondition | null>(null);
  const { updateNodeData } = useNodeDataChange();
  const flowForm = useForm<FormValues>({
    shouldUnregister: true,
    //@ts-ignore
    defaultValues: properties
      ? {
          description: properties?.data.description,
          email_data: {
            sender_email: properties?.data.email_data?.sender_email,
            subject: properties?.data.email_data?.subject,
            type: properties?.data.email_data?.type,
          },
          sms_data: {
            name: properties?.data.sms_data?.name,
            type: properties?.data.sms_data?.type,
          },
          notification_data: {
            to_name: properties?.data.notification_data?.to_name,
            type: properties?.data.notification_data?.type,
          },

          profile_data: {
            properties: properties?.data.profile_data?.properties,
            type: properties?.data.profile_data?.type,
          },
          delay_data: {
            delay: properties?.data.delay_data?.delay,
            unit: properties?.data.delay_data?.unit,
            type: properties?.data.delay_data?.type,
          },

          webhook_data: {
            name: properties?.data.webhook_data?.name,
          },
        }
      : defaultValues,
  });


  const avatarImageAlt = `${properties?.type}`;
  const { setValue, watch } = flowForm;
  const subject = watch('email_data.subject');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Placeholder.configure({ placeholder: 'Enter your description here.' }),
      // Superscript,
      // SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const description = editor?.getHTML();
      setValue('description', description);
    },
  });
  const addVariable = useCallback(
    (variable: string) => {
      editor?.commands.insertContent(variable);
    },
    [editor]
  );
  const addEmailVariable = (variable: string) => {
    let finalSubject;
    if (subject) {
      finalSubject = `${subject?.trim()} ${variable}`;
    } else {
      finalSubject = variable;
    }

    setValue('email_data.subject', finalSubject);
    // setSubject(finalSubject);
  };

  useEffect(() => {
    if (editor) {
      editor.commands.clearContent();
      editor?.commands.setContent(properties?.data.description || '');
    }
  }, [properties, editor]);

  const { fields, append, remove } = useFieldArray({
    control: flowForm.control,
    name: 'profile_data.properties',
  });

  useEffect(() => {
    // Reset the entire form state
    flowForm.reset({
      profile_data: {
        properties: properties?.data.profile_data?.properties || [],
      },
    });

    // Reset individual field values based on properties
    setValue('email_data.subject', '');
    setValue('email_data.sender_email', '');
    setValue('notification_data.to_name', '');
    setValue('profile_data.properties', []);

    // Set initial values from properties, if available
    if (properties?.data.email_data?.subject) {
      setValue('email_data.subject', properties?.data.email_data?.subject);
    }
    if (properties?.data.email_data?.sender_email) {
      setValue(
        'email_data.sender_email',
        properties?.data.email_data?.sender_email
      );
    }
    if (properties?.data.notification_data?.to_name) {
      setValue(
        'notification_data.to_name',
        properties?.data.notification_data?.to_name
      );
    }
    if (properties?.data.profile_data?.properties) {
      setValue(
        'profile_data.properties',
        properties?.data.profile_data?.properties
      );
    }
  }, [flowForm, properties, setValue]);
  const onSave = (data: FormValues) => {
    switch (properties?.type) {
      case NodeType.EMAIL:
        updateNodeData({
          id: properties?.id as string,
          data: {
            email_data: {
              sender_email: data?.email_data?.sender_email,
              subject: data?.email_data?.subject,
              type: properties.type,
            },
            description: data.description,
          },
        });

        setShowProperty(false);
        break;

      case NodeType.SMS:
        updateNodeData({
          id: properties?.id as string,
          data: {
            sms_data: {
              name: properties?.data.sms_data?.name,
              type: properties.type,
            },
            // sender_email:sender,
            description: data.description,
          },
        });

        setShowProperty(false);
        break;

      case NodeType.UPDATE_PROFILE:
        updateNodeData({
          id: properties?.id as string,
          data: {
            profile_data: {
              type: properties.type,
              properties: data.profile_data?.properties,
            },
          },
        });

        setShowProperty(false);
        break;
      case NodeType.NOTIFICATION:
        updateNodeData({
          id: properties?.id as string,
          data: {
            notification_data: {
              to_name: data.notification_data?.to_name,
              type: properties.type,
            },
            description: data.description,
          },
        });

        setShowProperty(false);
        break;

      case NodeType.TIME_DELAY:
        updateNodeData({
          id: properties?.id as string,
          data: {
            delay_data: {
              delay: data.delay_data?.delay,
              unit: data.delay_data?.unit,
              type: properties.type,
            },
          },
        });

        setShowProperty(false);
        break;

      case NodeType.CONDITION:
        updateNodeData({
          id: properties?.id as string,
          data: {
            condition_data: query,
          },
        });

        setShowProperty(false);
        break;
    }
  };

  const nodeToSettingsComponentMap: Record<string, ReactNode> = {
    [NodeType.EMAIL]: (
      <>
        {properties?.type === NodeType.EMAIL && (
          <div className='pb-5 w-full'>
            <div className='flex px-2 py-4 items-center gap-3 border-b'>
            <Avatar>
                <AvatarImage
                  className="bg-red-600"
                  src=""
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(properties?.type))}>
                <Icons.mail size={20} />
                </AvatarFallback>
              </Avatar>
              
              <h5 className='text-lg font-bold '>Subject and sender</h5>
            </div>
            <div className='px-3 my-3'>
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <div className='flex justify-between items-center'>
                    <Label>Subject</Label>
                    <SideVariable {...{ addVariable: addEmailVariable }} />
                  </div>
                  <FormField
                    control={flowForm.control}
                    name='email_data.subject'
                    defaultValue={properties?.data?.email_data?.subject as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-1'>
                  <Label>Sender Email</Label>
                  <FormField
                    control={flowForm.control}
                    name='email_data.sender_email'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold border-b pb-2'>
                    Description
                  </h3>
                  <SideVariable {...{ addVariable }} />
                </div>
                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                      {/* <RichTextEditor.Subscript />
                 <RichTextEditor.Superscript /> */}
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.AlignLeft />
                      <RichTextEditor.AlignCenter />
                      <RichTextEditor.AlignJustify />
                      <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Undo />
                      <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content />
                </RichTextEditor>
              </div>
            </div>
          </div>
        )}
      </>
    ),

    [NodeType.SMS]: (
      <>
        {properties?.type === NodeType.SMS && (
          <div className='pb-5 w-full'>
            <div className='flex px-2 py-4 items-center gap-3 border-b w-full'>
            <Avatar>
                <AvatarImage
                  className="bg-red-600"
                  src=""
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(properties?.type))}>
                <Icons.message size={20} />
                </AvatarFallback>
              </Avatar>
             

              <h5 className='text-lg font-bold '>SMS details</h5>
            </div>
            <div className='px-3 my-3 '>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold border-b pb-2'>Text</h3>
                  <SideVariable {...{ addVariable }} />
                </div>

                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar
                    sticky
                    stickyOffset={60}
                  ></RichTextEditor.Toolbar>
                  <RichTextEditor.Content />
                </RichTextEditor>
              </div>
            </div>
          </div>
        )}
      </>
    ),

    [NodeType.NOTIFICATION]: (
      <>
        {properties?.type === NodeType.NOTIFICATION && (
          <div className='pb-5'>
            <div className='flex px-2 py-4 items-center gap-3 border-b'>
           
              <Avatar>
                <AvatarImage
                  className="bg-red-600"
                  src=""
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(properties?.type))}>
                <Icons.bell size={20} />
                </AvatarFallback>
              </Avatar>
              <h5 className='text-lg font-bold '>Internal Alert Details</h5>
            </div>
            <div className='px-3 my-3 '>
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <Label>From</Label>
                  <FormField
                    control={flowForm.control}
                    name='notification_data.to_name'
                    // defaultValue={
                    //   properties.data.notification_data?.to_name as any
                    // }
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <h3 className='text-lg font-semibold border-b pb-2'>Message</h3>
                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                      {/* <RichTextEditor.Subscript />
                 <RichTextEditor.Superscript /> */}
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.AlignLeft />
                      <RichTextEditor.AlignCenter />
                      <RichTextEditor.AlignJustify />
                      <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Undo />
                      <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content  className='h-16'/>
                </RichTextEditor>
              </div>
            </div>
          </div>
        )}
      </>
    ),

    [NodeType.UPDATE_PROFILE]: (
      <>
        {properties?.type === NodeType.UPDATE_PROFILE && (
          <div className='pb-5'>
            <div className='flex px-2 py-4 items-center gap-3 border-b'>
             
              <Avatar>
                <AvatarImage
                  className="bg-red-600"
                  src=""
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(properties?.type))}>
                <Icons.user size={20} />
                </AvatarFallback>
              </Avatar>
              <h5 className='text-lg font-bold '>User profile details</h5>
            </div>

            <div className='px-2 py-4'>
              <p className='text-xs'>
                Add, update, or remove properties for a profile when they enter
                this stage in the flow.
              </p>
            </div>
            <div className='px-3 my-3 '>
              <Card className=' w-full px-3 py-3 flex flex-col gap-5'>
                <div className='flex flex-col gap-5'>
                  {fields.map((item: any & { id: string }, index: number) => (
                    <div
                      className='  first:pt-0  border px-3 py-3 rounded-lg'
                      key={item.id}
                    >
                      <div className='flex  justify-end mb-5'>
                        <button
                          onClick={() => {
                            remove(index);
                          }}
                          type='button'
                          className='text-sm text-black hover:bg-gray-200 p-1 rounded-md transition-all  duration-500 focus:outline-none sm:mt-4 sm:col-span-1 self-end'
                        >
                          <Icons.trash size={20} />
                          <span className='sr-only'>remove</span>
                        </button>
                      </div>
                      <div className='grid grid-cols-1 gap-5'>
                        <FormField
                          control={flowForm.control}
                          name={
                            `profile_data.properties.${index}.actionId` as const
                          }
                          render={({ field }) => (
                            <FormItem className='flex flex-col'>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={watch(
                                    `profile_data.properties.${index}.actionId`
                                  )}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a property' />
                                  </SelectTrigger>

                                  <SelectContent className='' align='end'>
                                    {propertyOptions.map((item, index) => (
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

                        {watch(`profile_data.properties.${index}.actionId`) ===
                          '1' && (
                          <div className='flex flex-col gap-4'>
                            <FormField
                              control={flowForm.control}
                              name={
                                `profile_data.properties.${index}.label` as const
                              }
                              render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={watch(
                                        `profile_data.properties.${index}.label`
                                      )}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder='Select a property' />
                                      </SelectTrigger>

                                      <SelectContent className='' align='end'>
                                        {propertyData.map((item, index) => (
                                          <SelectItem
                                            key={index}
                                            value={item.value}
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

                            <div className='space-y-1'>
                              <FormField
                                control={flowForm.control}
                                name={
                                  `profile_data.properties.${index}.value` as const
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder='Property value'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}

                        {watch(`profile_data.properties.${index}.actionId`) ==
                          '2' && (
                          <div className='flex flex-col gap-4'>
                            <div className='space-y-1 flex items-center justify-between gap-5 w-full'>
                              <FormField
                                control={flowForm.control}
                                name={
                                  `profile_data.properties.${index}.label` as const
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder='Property label'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={flowForm.control}
                                name={
                                  `profile_data.properties.${index}.type` as const
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={watch(
                                          `profile_data.properties.${index}.type`
                                        )}
                                      >
                                        <SelectTrigger className='w-[150px]'>
                                          <SelectValue
                                            placeholder='Select a type'
                                            className='placeholder:text-xm'
                                          />
                                        </SelectTrigger>

                                        <SelectContent className='' align='end'>
                                          <SelectItem
                                            value='text'
                                            defaultChecked
                                          >
                                            Text
                                          </SelectItem>
                                          <SelectItem value='boolean'>
                                            Boolean
                                          </SelectItem>
                                          <SelectItem value='number'>
                                            Number
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className='space-y-1 '>
                              <FormField
                                control={flowForm.control}
                                name={
                                  `profile_data.properties.${index}.value` as const
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder='Property value'
                                      />
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
                    type='button'
                    onClick={() =>
                      append({
                        value: '',
                        label: '',
                        type: '',
                        actionId: '',
                      })
                    }
                    className='w-full sm:w-auto bg-transparent text-black font-semibold hover:bg-gray-300 self-start border border-black'
                  >
                    <Icons.plus size={20} className='mr-1' />
                    Add step
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </>
    ),

    [NodeType.TIME_DELAY]: (
      <>
        {properties?.type === NodeType.TIME_DELAY && (
          <div className='pb-5'>
            <div className='flex px-2 py-4 items-center gap-3 border-b'>
            
              <Avatar>
                <AvatarImage
                  className="bg-red-600"
                  src=""
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(properties?.type))}>
                <Icons.clock size={20} />
                </AvatarFallback>
              </Avatar>
              <h5 className='text-lg font-bold '>Time delay details</h5>
            </div>
            <div className='px-3 my-3 '>
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <Label>Set time delay</Label>
                  <FormField
                    control={flowForm.control}
                    name='delay_data.delay'
                    defaultValue={properties?.data?.delay_data?.delay as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={flowForm.control}
                    name='delay_data.unit'
                    defaultValue={properties?.data?.delay_data?.unit as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder='Select delay unit' />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value='Day' defaultChecked>
                                Day
                              </SelectItem>
                              <SelectItem value='Hours'>Hours</SelectItem>
                              <SelectItem value='Minutes'>Minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    ),

    [NodeType.WEBHOOK]: (
      <>
        {properties?.type === NodeType.WEBHOOK && (
          <div className='pb-5'>
            <div className='flex px-2 py-4 items-center gap-3 border-b'>
              <Icons.settings size={20} />
              <h5 className='text-lg font-bold '>Settings</h5>
            </div>
            <div className='px-3 my-3 '>
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <Label>Comming soon</Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    ),

    [NodeType.CONDITION]: (
      <>
        {properties?.type === NodeType.CONDITION && (
          <div className='pb-5'>
            <div className='flex px-2 py-4 items-center gap-3 border-b'>
             
              <Avatar>
                <AvatarImage
                  className="bg-red-600"
                  src=""
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(properties?.type))}>
                <Icons.condition size={20} />
                </AvatarFallback>
              </Avatar>
              <h5 className='text-lg font-bold '>Conditional split details</h5>
            </div>

            <div className='px-2 py-4'>
              <p className='text-xs'>
                Create a split in your flow based on a profile’s properties or
                behavior.
              </p>
            </div>
            <div className='px-3 my-3 '>
              <QueryBuilderShadcnUi>
                <QueryBuilder
                  controlClassnames={{ queryBuilder: 'queryBuilder-branches ' }}
                  fields={conditionfields as any}
                  // combinators={[{ name: "AND", label: "AND" }, { name: "OR", label: "OR" }]}
                  operators={operators}
                  onQueryChange={setQuery}
                  showNotToggle
                  defaultQuery={properties.data.condition_data as any}
                />
              </QueryBuilderShadcnUi>
              {/* <ConditionalForm/> */}
            </div>
          </div>
        )}
      </>
    ),
  };

  return (
    <div
      className={cn(
        "bg-background border rounded-md transition-['width'] duration-300 h-screen flex flex-col pb-4 ",
        showProperty ? 'w-[500px] opacity-100' : 'w-0 hidden'
      )}
    >
      <h2
        className='text-lg font-semibold p-2 text-center text-white'
        style={{ background: properties?.data?.background }}
      >
        {properties?.data?.label}
      </h2>
      <Form {...flowForm}>
        <form
          className='flex flex-col justify-between  w-full  h-screen '
          onSubmit={(...args) => void flowForm.handleSubmit(onSave)(...args)}
        >
          <div className='overflow-y-auto space-y-5 mx-5 mt-3  border rounded-lg  flex-1'>
            {nodeToSettingsComponentMap[properties?.type || '']}
          </div>
          <div>
            <div className='px-2'>
              <Button className='mt-5 w-full' type='submit'>
                Save
              </Button>
            </div>
            <div className='px-2'>
              <Button
                className='mt-2 w-full bg-red-400 hover:bg-red-500'
                onClick={() => {
                  setProperties(null);
                  setShowProperty(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
