import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/api/axiosConfig';
import { EventRequest, CategoryDto, EventDto, UploadResponse } from '@/types';
import { ArrowLeft, Upload, X, Image } from 'lucide-react';

export const EventForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventRequest>({
    name: '',
    description: '',
    organizingClub: '',
    dateTime: '',
    venue: '',
    posterUrl: '',
    maxAttendees: 0,
    registrationPrice: 0,
    categoryId: 0,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchEventData();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get<CategoryDto[]>('/api/public/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEventData = async () => {
    try {
      const response = await axiosInstance.get<EventDto>(`/api/public/events/${id}`);
      const event = response.data;
      
      const category = categories.find(c => c.name === event.categoryName);
      
      setFormData({
        name: event.name,
        description: event.description,
        organizingClub: event.organizingClub,
        dateTime: event.dateTime,
        venue: event.venue,
        posterUrl: event.posterUrl,
        maxAttendees: event.maxAttendees,
        registrationPrice: event.registrationPrice,
        categoryId: category?.id || 0,
      });
      
      if (event.posterUrl) {
        setImagePreview(event.posterUrl);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event data',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (field: keyof EventRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await axiosInstance.post<UploadResponse>(
        '/api/admin/upload',
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const uploadedUrl = response.data.url;
      setFormData(prev => ({ ...prev, posterUrl: uploadedUrl }));
      setImagePreview(uploadedUrl);

      toast({
        title: 'Image uploaded',
        description: 'Poster image uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, posterUrl: '' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.posterUrl) {
      toast({
        title: 'Poster required',
        description: 'Please upload a poster image',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        await axiosInstance.put(`/api/admin/events/${id}`, formData);
        toast({ title: 'Event updated successfully' });
      } else {
        await axiosInstance.post('/api/admin/events', formData);
        toast({ title: 'Event created successfully' });
      }
      navigate('/admin/manage-events');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/manage-events')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizingClub">Organizing Club</Label>
                  <Input
                    id="organizingClub"
                    value={formData.organizingClub}
                    onChange={(e) => handleChange('organizingClub', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(value) => handleChange('categoryId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateTime">Date & Time</Label>
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) => handleChange('dateTime', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Event Poster</Label>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Event poster preview"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-2"></div>
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Image className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => handleChange('maxAttendees', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationPrice">Registration Price (₹)</Label>
                  <Input
                    id="registrationPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.registrationPrice}
                    onChange={(e) => handleChange('registrationPrice', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading || isUploading}>
                  {isLoading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/manage-events')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};