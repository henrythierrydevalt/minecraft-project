import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'int', nullable: true })
  port: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ nullable: true })
  version: string;

  @Column({ type: 'int', default: 0 })
  onlinePlayers: number;

  @Column({ type: 'int', default: 0 })
  maxPlayers: number;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: 'survival' })
  gamemode: string;

  @Column({ type: 'int', default: 0 })
  votes: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

