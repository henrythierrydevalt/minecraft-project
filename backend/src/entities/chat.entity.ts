import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

export enum ChatStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  MUTED = 'muted',
}

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @Column()
  user1Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @Column()
  user2Id: string;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.PENDING,
  })
  status: ChatStatus;

  @Column({ nullable: true })
  blockedBy: string; // userId que bloqueou

  @Column({ default: false })
  user1Muted: boolean;

  @Column({ default: false })
  user2Muted: boolean;

  @OneToMany(() => ChatMessage, (message) => message.chat, { cascade: true })
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


