'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ClassSelectorProps {
  value: string
  onChange: (value: string) => void
}

// 模拟班级数据
const CLASSES = [
  { id: 'C1', name: '一班' },
  { id: 'C2', name: '二班' },
  { id: 'C3', name: '三班' },
  { id: 'C4', name: '四班' },
]

export function ClassSelector({ value, onChange }: ClassSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="选择班级" />
      </SelectTrigger>
      <SelectContent>
        {CLASSES.map(cls => (
          <SelectItem key={cls.id} value={cls.id}>
            {cls.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 