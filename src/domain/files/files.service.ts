import { Stream as WriteAbleStream } from 'stream';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { IGridFSObject, IGridFSWriteOption, MongoGridFS } from 'mongo-gridfs';
import {
	GridFSBucket,
	GridFSBucketReadStream,
	GridFSFile,
	ObjectId,
	Stream,
} from 'mongodb';
import { Connection, Types } from 'mongoose';


type FileContent = {
	_id: string,
	metadata?: any,
	content: string,
};


@Injectable()
export class FilesService {
	private readonly _fileModel: MongoGridFS;
	private readonly _bucket: GridFSBucket;

	constructor(@InjectConnection() private readonly _connection: Connection) {
		this._fileModel = new MongoGridFS(this._connection.db, 'images');
		this._bucket = new GridFSBucket(this._connection.db);
	}

	public async readStream(id: string): Promise<GridFSBucketReadStream> {
		return await this._fileModel.readFileStream(id);
	}

	public async writeStream(
		stream: Stream,
		options?: IGridFSWriteOption,
	): Promise<IGridFSObject> {
		return await this._fileModel.writeFileStream(stream, options);
	}

	public async findInfo(id: string): Promise<IGridFSObject> {
		const result = await this._fileModel.findById(id);
		return result;
	}

	public async deleteFile(id: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this._bucket.delete(new ObjectId(id), (error) => {
				if (error) {
					reject(error);
				} else {
					resolve(true);
				}
			});
		});
	}

	public async writeFile(
		file: DiskFile,
		metadata?: any,
	): Promise<IGridFSObject> {
		return await this._fileModel.uploadFile(
			file.path,
			{
				filename: file.originalname,
				contentType: file.mimetype,
				metadata,
			},
			true,
		);
	}

	public async upload(file: Express.Multer.File): Promise<ObjectId> {
		const id = new ObjectId();
		const uploadStream = this._bucket.openUploadStreamWithId(
			id,
			file.filename,
			{
				contentType: file.mimetype,
			},
		);
		uploadStream.end(file.buffer);
		return new Promise((resolve, reject) => {
			uploadStream.on('error', reject);
			uploadStream.on('finish', () => resolve(uploadStream.id));
		});
	}

	public async findAll(): Promise<GridFSFile[]> {
		return await this._bucket.find().toArray();
	}

	private async _getFileContent(fileId: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let fileContent = '';
			const downloadStream = this._bucket.openDownloadStream(
				new ObjectId(fileId),
			);
			downloadStream.on('data', (chunk) => {
				fileContent += chunk.toString('base64');
			});
			downloadStream.on('error', reject);
			downloadStream.on('end', () => {
				resolve(fileContent);
			});
		});
	}

	public async findOne(id: string): Promise<FileContent> {
		const content = await this._getFileContent(id);
		return { _id: id, content };
	}
}

type DiskFile = {
	path: string,
	originalname: string,
	mimetype: string,
};
