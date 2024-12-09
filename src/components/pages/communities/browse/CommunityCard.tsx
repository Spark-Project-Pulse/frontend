'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Community } from '@/types/Communities'
import { type TagOption } from '@/types/Tags'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Users } from 'lucide-react'

interface CommunityCardProps {
  community: Community
  tags: TagOption[]
  onCardClick: () => void
  maxCharacters?: number
}

export default function CommunityCard({
  community,
  tags,
  onCardClick,
  maxCharacters = 200,
}: CommunityCardProps) {
  return (
    <div className="bg-gradient-to-b from-primary to-tertiary p-[2px] rounded-md">
      <Card
        key={community.community_id}
        onClick={onCardClick}
        className="flex transform cursor-pointer flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg"
      >
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={community?.avatar_url ?? '/default-community-avatar.png'}
              alt="Community avatar"
            />
          </Avatar>
          <CardTitle>{community.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="mb-4 font-body"
            aria-label={community.description}
          >
            {community.description.slice(0, maxCharacters)}
            {community.description.length > maxCharacters && '...'}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {community.tags?.map((tagId) => {
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
              {community.member_count.toLocaleString()} members
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}