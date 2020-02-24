import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Pixel } from '../pixel/pixel.entity';
@ObjectType()
@Entity()
export class Shop extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  public id: string;

  @Field()
  @Column()
  public email: string;

  @Field()
  @Column()
  public domain: string;

  @Field()
  @Column({ nullable: true })
  public primaryDomain: string;

  @Column({ nullable: false })
  public accessToken: string;

  @Field(() => [Pixel])
  @OneToMany(
    () => Pixel,
    pixel => pixel.shop,
    { eager: true },
  )
  public pixels?: Pixel[];

  @Field()
  @CreateDateColumn()
  public createAt: Date;

  @Field()
  @UpdateDateColumn()
  public updateAt: Date;
}
