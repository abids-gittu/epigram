import conf from "../conf/conf.js";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  tablesDB;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.tables = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.tablesDB.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        data: { title, slug, content, featuredImage, status, userId },
      });
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(rowId, { title, content, featuredImage, status }) {
    try {
      return await this.tablesDB.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId,
        data: { title, content, featuredImage, status },
      });
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(rowId) {
    try {
      await this.tablesDB.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(rowId) {
    try {
      return await this.tablesDB.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId,
      });
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.tablesDB.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        queries,
      });
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createBucket(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteBucket(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getBucketPreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service();
export default service;