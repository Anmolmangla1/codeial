{let t=function(){let t=$("#new-post-form");t.submit((function(o){o.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:t.serialize(),success:function(t){let o=e(t.data.post_data);$("#posts-list-container>ul").prepend(o),n($(" .delete-post-button",o)),new PostComments(t.data.post_data._id),new ToggleLike($(" .toggle-like-button",o))},error:function(t){console.log(t.responseText)}})}))},e=function(t){return $(`\n                    <li id="post-${t._id}">\n                        <p>\n                            <small>\n                                <a class="delete-post-button" href="/posts/destroy/${t._id}">Delete</a>\n                            </small>\n                        \n                            ${t.content}\n                            <br>\n                            <small>\n                                ${t.user.name}\n                            </small>\n                            <br>\n                            <small>\n                            \n                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${t._id}&type=Post">\n                                    0 Likes\n                                </a>\n                            \n                            </small>\n                        </p>\n                        <div class="post-comments">\n                            \n                                <form action="/comments/create" method="POST">\n                                    <input type="text" name="content" placeholder="Type Here to add a Comment" required>\n                                    <input type="hidden" name="post" value="${t._id}">\n                                    <input type="submit" value="Add Comment">\n                                </form>\n                            \n                    \n                            <div class="post-comments-list">\n                                <ul id="post-comments-${t._id}">\n                                    \n                                </ul>\n                            </div>\n                        </div>\n                    </li>\n        \n                `)},n=function(t){$(t).click((function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(t){$(`#post-${t.data.post_id}`).remove()},error:function(t){console.log(error.responseText)}})}))},o=function(){$("#posts-list-container>ul>li").each((function(){let t=$(this),e=$(" .delete-post-button",t);n(e);let o=t.prop("id").split("-")[1];new PostComments(o)}))};t(),o()}