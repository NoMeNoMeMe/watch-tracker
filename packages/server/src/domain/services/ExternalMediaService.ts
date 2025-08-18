export interface ExternalMediaService {
  /**
   * Searches for media items based on a query and type.
   * @param query The search keyword.
   * @param type The media type (e.g., 'movie', 'series', 'book').
   */
  search(query: string, type: string): Promise<any>;

  /**
   * Retrieves detailed information about a media item.
   * @param id The identifier of the media item.
   */
  getDetails?(id: string): Promise<any>;
}
