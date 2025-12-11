import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  MENTION = 'mention',
  SERVER_VOTE = 'server_vote',
  POST_APPROVED = 'post_approved',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  relatedUserId: string;

  @Column({ nullable: true })
  relatedPostId: string;

  @Column({ nullable: true })
  relatedServerId: string;

  @CreateDateColumn()
  createdAt: Date;
}

