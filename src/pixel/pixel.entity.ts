import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Shop } from '../shop/shop.entity';

@ObjectType()
@Entity()
export class Pixel extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public collection: string;

  @Field()
  @Column()
  public pixel: string;

  @Column()
  public shopId: string;

  @Field(() => Shop)
  @ManyToOne(
    () => Shop,
    shop => shop.pixels,
    { onDelete: 'CASCADE' },
  )
  // 用这个有问题
  // @JoinColumn({ name: 'shopId' })
  public shop: Shop;

  @Field()
  @CreateDateColumn()
  public createAt: Date;

  @Field()
  @UpdateDateColumn()
  public updateAt: Date;
}
