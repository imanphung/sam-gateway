import { Component, Provide, Vue } from 'vue-property-decorator';

import UserService from '@/entities/user/user.service';
import TagService from './blog/tag/tag.service';
import ProductService from './store/product/product.service';
import BlogService from './blog/blog/blog.service';
import PostService from './blog/post/post.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

@Component
export default class Entities extends Vue {
  @Provide('userService') private userService = () => new UserService();
  @Provide('tagService') private tagService = () => new TagService();
  @Provide('productService') private productService = () => new ProductService();
  @Provide('blogService') private blogService = () => new BlogService();
  @Provide('postService') private postService = () => new PostService();
  // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
}
