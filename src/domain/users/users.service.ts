import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryWithHelpers, UpdateWriteOpResult } from 'mongoose';
import { DeleteResult } from 'mongodb';

import { Course } from '../courses/entities/course.entity';
import { PurchasedCourse, PurchasedCourseDocument } from '../courses/entities/purchased-course.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';


@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly _userModel: Model<User>,
	) {}

	public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		return this._userModel.create(createUserDto);
	}

	public async findAll(): Promise<UserDocument[]> {
		return this._userModel.find().populate({
			path: PurchasedCourse.plural,
			populate: {
				path: Course.singular,
				model: Course.name
			}
		});
	}

	public async findOneById(id: string, pathNavs: string[] = []): Promise<UserDocument> {
		const user = await this._userModel
			.findById(id)
			.populate(pathNavs)
			.orFail(() => new NotFoundException('User not found'));
		return user;
	}

	public async findOne(
		filter: FilterQuery<UserDocument | null>,
	): Promise<UserDocument> {
		const user = await this._userModel.findOne(filter);
		return user;
	}

	public async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<UpdateWriteOpResult> {
		return this._userModel.updateOne<UserDocument>({ _id: id }, updateUserDto, {
			new: true,
		});
	}

	public async remove(id: string): Promise<DeleteResult> {
		return this._userModel.deleteOne({ _id: id });
	}

	public async purchaseCourses(userId: string, purchasedCourses: PurchasedCourseDocument[]) {
		const user = await this.findOneById(userId);
		user.purchasedCourses.push(...purchasedCourses);
		await this.update(userId, user);
	}
}
