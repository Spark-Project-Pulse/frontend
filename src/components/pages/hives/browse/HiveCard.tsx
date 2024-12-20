'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Hive } from '@/types/Hives'
import { type TagOption } from '@/types/Tags'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Users } from 'lucide-react'

interface HiveCardProps {
  hive: Hive
  tags: TagOption[]
  onCardClick: () => void
  maxCharacters?: number
}

export default function HiveCard({
  hive,
  tags,
  onCardClick,
  maxCharacters = 30,
}: HiveCardProps) {
  return (
    <div className="gradient-border">
      <Card
        key={hive.hive_id}
        onClick={onCardClick}
        className="flex w-full h-full transform cursor-pointer flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:border-primary"
      >
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={hive?.avatar_url ?? '/default-hive-avatar.png'}
              alt="Hive avatar"
            />
          </Avatar>
          <CardTitle>{hive.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="mb-4 font-body"
            aria-label={hive.description}
          >
            {hive.description.slice(0, maxCharacters)}
            {hive.description.length > maxCharacters && '...'}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {hive.tags?.map((tagId) => {
              const tag = tags.find((t) => t.value === tagId)
              return tag ? (
                <Badge key={tagId} variant="secondary">
                  {tag.label}
                </Badge>
              ) : null // Handle cases where tag is not found
            })}
          </div>
          <div className="flex items-center gap-4 text-p15 text-black">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {hive.member_count.toLocaleString()} members
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
