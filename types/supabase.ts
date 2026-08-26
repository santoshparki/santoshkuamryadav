export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      about: {
        Row: {
          createdAt: string
          id: string
          longBio: string | null
          readMoreButtonText: string | null
          sectionSubtitle: string | null
          sectionTitle: string | null
          shortBio: string | null
          showLessButtonText: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          longBio?: string | null
          readMoreButtonText?: string | null
          sectionSubtitle?: string | null
          sectionTitle?: string | null
          shortBio?: string | null
          showLessButtonText?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          longBio?: string | null
          readMoreButtonText?: string | null
          sectionSubtitle?: string | null
          sectionTitle?: string | null
          shortBio?: string | null
          showLessButtonText?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "about_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      about_tags: {
        Row: {
          aboutId: string
          createdAt: string
          displayOrder: number
          icon: string | null
          id: string
          isActive: boolean
          label: string
          updatedAt: string
        }
        Insert: {
          aboutId: string
          createdAt?: string
          displayOrder?: number
          icon?: string | null
          id?: string
          isActive?: boolean
          label: string
          updatedAt: string
        }
        Update: {
          aboutId?: string
          createdAt?: string
          displayOrder?: number
          icon?: string | null
          id?: string
          isActive?: boolean
          label?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "about_tags_aboutId_fkey"
            columns: ["aboutId"]
            isOneToOne: false
            referencedRelation: "about"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          slug: string
          sortOrder: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sortOrder?: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sortOrder?: number
          updatedAt?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          authorId: string | null
          categoryId: string | null
          content: string | null
          coverImageUrl: string | null
          createdAt: string
          excerpt: string | null
          id: string
          isFeatured: boolean
          publishedAt: string | null
          seoDescription: string | null
          seoKeywords: string[] | null
          seoTitle: string | null
          slug: string
          status: Database["public"]["Enums"]["BlogStatus"]
          title: string
          updatedAt: string
        }
        Insert: {
          authorId?: string | null
          categoryId?: string | null
          content?: string | null
          coverImageUrl?: string | null
          createdAt?: string
          excerpt?: string | null
          id?: string
          isFeatured?: boolean
          publishedAt?: string | null
          seoDescription?: string | null
          seoKeywords?: string[] | null
          seoTitle?: string | null
          slug: string
          status?: Database["public"]["Enums"]["BlogStatus"]
          title: string
          updatedAt: string
        }
        Update: {
          authorId?: string | null
          categoryId?: string | null
          content?: string | null
          coverImageUrl?: string | null
          createdAt?: string
          excerpt?: string | null
          id?: string
          isFeatured?: boolean
          publishedAt?: string | null
          seoDescription?: string | null
          seoKeywords?: string[] | null
          seoTitle?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["BlogStatus"]
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blogs_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          createdAt: string
          credentialUrl: string | null
          description: string | null
          id: string
          issueDate: string | null
          issuer: string
          sortOrder: number
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          credentialUrl?: string | null
          description?: string | null
          id?: string
          issueDate?: string | null
          issuer: string
          sortOrder?: number
          title: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          credentialUrl?: string | null
          description?: string | null
          id?: string
          issueDate?: string | null
          issuer?: string
          sortOrder?: number
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          createdAt: string
          email: string
          id: string
          isRead: boolean
          isReplied: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: string
          isRead?: boolean
          isReplied?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          isRead?: boolean
          isReplied?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          createdAt: string
          degree: string
          description: string | null
          endDate: string | null
          fieldOfStudy: string | null
          id: string
          institution: string
          location: string | null
          sortOrder: number
          startDate: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          degree: string
          description?: string | null
          endDate?: string | null
          fieldOfStudy?: string | null
          id?: string
          institution: string
          location?: string | null
          sortOrder?: number
          startDate?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          degree?: string
          description?: string | null
          endDate?: string | null
          fieldOfStudy?: string | null
          id?: string
          institution?: string
          location?: string | null
          sortOrder?: number
          startDate?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          createdAt: string
          description: string | null
          endDate: string | null
          id: string
          isCurrent: boolean
          location: string | null
          position: string
          sortOrder: number
          startDate: string | null
          updatedAt: string
        }
        Insert: {
          company: string
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id?: string
          isCurrent?: boolean
          location?: string | null
          position: string
          sortOrder?: number
          startDate?: string | null
          updatedAt: string
        }
        Update: {
          company?: string
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id?: string
          isCurrent?: boolean
          location?: string | null
          position?: string
          sortOrder?: number
          startDate?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      hero: {
        Row: {
          availabilityStatus: string | null
          backgroundImageUrl: string | null
          createdAt: string
          ctaHref: string | null
          ctaLabel: string | null
          enableResumeDownload: boolean
          fullName: string | null
          heading: string | null
          headline: string | null
          heroImageUrl: string | null
          id: string
          location: string | null
          primaryButtonText: string | null
          primaryButtonUrl: string | null
          professionalTitle: string | null
          resumeButtonHref: string | null
          resumeButtonLabel: string | null
          resumeButtonText: string | null
          resumeFileName: string | null
          resumeFileType: string | null
          resumeUrl: string | null
          secondaryButtonText: string | null
          secondaryButtonUrl: string | null
          showAvailabilityBadge: boolean
          showSocialLinks: boolean
          subHeading: string | null
          subheadline: string | null
          updatedAt: string
          yearsOfExperience: number | null
        }
        Insert: {
          availabilityStatus?: string | null
          backgroundImageUrl?: string | null
          createdAt?: string
          ctaHref?: string | null
          ctaLabel?: string | null
          enableResumeDownload?: boolean
          fullName?: string | null
          heading?: string | null
          headline?: string | null
          heroImageUrl?: string | null
          id?: string
          location?: string | null
          primaryButtonText?: string | null
          primaryButtonUrl?: string | null
          professionalTitle?: string | null
          resumeButtonHref?: string | null
          resumeButtonLabel?: string | null
          resumeButtonText?: string | null
          resumeFileName?: string | null
          resumeFileType?: string | null
          resumeUrl?: string | null
          secondaryButtonText?: string | null
          secondaryButtonUrl?: string | null
          showAvailabilityBadge?: boolean
          showSocialLinks?: boolean
          subHeading?: string | null
          subheadline?: string | null
          updatedAt: string
          yearsOfExperience?: number | null
        }
        Update: {
          availabilityStatus?: string | null
          backgroundImageUrl?: string | null
          createdAt?: string
          ctaHref?: string | null
          ctaLabel?: string | null
          enableResumeDownload?: boolean
          fullName?: string | null
          heading?: string | null
          headline?: string | null
          heroImageUrl?: string | null
          id?: string
          location?: string | null
          primaryButtonText?: string | null
          primaryButtonUrl?: string | null
          professionalTitle?: string | null
          resumeButtonHref?: string | null
          resumeButtonLabel?: string | null
          resumeButtonText?: string | null
          resumeFileName?: string | null
          resumeFileType?: string | null
          resumeUrl?: string | null
          secondaryButtonText?: string | null
          secondaryButtonUrl?: string | null
          showAvailabilityBadge?: boolean
          showSocialLinks?: boolean
          subHeading?: string | null
          subheadline?: string | null
          updatedAt?: string
          yearsOfExperience?: number | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          createdAt: string
          description: string | null
          isVisible: boolean
          key: string
          sortOrder: number
          title: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          isVisible?: boolean
          key: string
          sortOrder?: number
          title?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          isVisible?: boolean
          key?: string
          sortOrder?: number
          title?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          createdAt: string
          filename: string
          filePath: string
          fileSize: number | null
          fileType: string | null
          folder: string | null
          id: string
          isPublic: boolean
          mediaType: string | null
          originalFilename: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          filename: string
          filePath: string
          fileSize?: number | null
          fileType?: string | null
          folder?: string | null
          id?: string
          isPublic?: boolean
          mediaType?: string | null
          originalFilename: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          filename?: string
          filePath?: string
          fileSize?: number | null
          fileType?: string | null
          folder?: string | null
          id?: string
          isPublic?: boolean
          mediaType?: string | null
          originalFilename?: string
          updatedAt?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          caption: string | null
          createdAt: string
          id: string
          projectId: string
          sortOrder: number
          updatedAt: string
          url: string
        }
        Insert: {
          caption?: string | null
          createdAt?: string
          id?: string
          projectId: string
          sortOrder?: number
          updatedAt: string
          url: string
        }
        Update: {
          caption?: string | null
          createdAt?: string
          id?: string
          projectId?: string
          sortOrder?: number
          updatedAt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          createdAt: string
          description: string | null
          featured: boolean
          githubUrl: string | null
          id: string
          liveUrl: string | null
          shortDescription: string | null
          slug: string
          status: Database["public"]["Enums"]["ProjectStatus"]
          technologies: string[] | null
          title: string
          updatedAt: string
        }
        Insert: {
          category?: string | null
          createdAt?: string
          description?: string | null
          featured?: boolean
          githubUrl?: string | null
          id?: string
          liveUrl?: string | null
          shortDescription?: string | null
          slug: string
          status?: Database["public"]["Enums"]["ProjectStatus"]
          technologies?: string[] | null
          title: string
          updatedAt: string
        }
        Update: {
          category?: string | null
          createdAt?: string
          description?: string | null
          featured?: boolean
          githubUrl?: string | null
          id?: string
          liveUrl?: string | null
          shortDescription?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["ProjectStatus"]
          technologies?: string[] | null
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          createdAt: string
          description: string | null
          displayOrder: number
          features: string[] | null
          icon: string | null
          id: string
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          displayOrder?: number
          features?: string[] | null
          icon?: string | null
          id?: string
          title: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          displayOrder?: number
          features?: string[] | null
          icon?: string | null
          id?: string
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          createdAt: string
          faviconUrl: string | null
          googleAnalytics: string | null
          id: string
          logoUrl: string | null
          metaTags: string[] | null
          seoDescription: string | null
          seoTitle: string | null
          siteTitle: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          faviconUrl?: string | null
          googleAnalytics?: string | null
          id?: string
          logoUrl?: string | null
          metaTags?: string[] | null
          seoDescription?: string | null
          seoTitle?: string | null
          siteTitle?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          faviconUrl?: string | null
          googleAnalytics?: string | null
          id?: string
          logoUrl?: string | null
          metaTags?: string[] | null
          seoDescription?: string | null
          seoTitle?: string | null
          siteTitle?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_categories: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          slug: string
          sortOrder: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sortOrder?: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sortOrder?: number
          updatedAt?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          categoryId: string | null
          createdAt: string
          description: string | null
          icon: string | null
          id: string
          isFeatured: boolean
          level: string | null
          name: string
          percentage: number | null
          sortOrder: number
          updatedAt: string
        }
        Insert: {
          categoryId?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          isFeatured?: boolean
          level?: string | null
          name: string
          percentage?: number | null
          sortOrder?: number
          updatedAt: string
        }
        Update: {
          categoryId?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          isFeatured?: boolean
          level?: string | null
          name?: string
          percentage?: number | null
          sortOrder?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          createdAt: string
          facebookUrl: string | null
          githubUrl: string | null
          id: string
          instagramUrl: string | null
          linkedinUrl: string | null
          portfolioUrl: string | null
          updatedAt: string
          userId: string
          xUrl: string | null
          youtubeUrl: string | null
        }
        Insert: {
          createdAt?: string
          facebookUrl?: string | null
          githubUrl?: string | null
          id?: string
          instagramUrl?: string | null
          linkedinUrl?: string | null
          portfolioUrl?: string | null
          updatedAt: string
          userId: string
          xUrl?: string | null
          youtubeUrl?: string | null
        }
        Update: {
          createdAt?: string
          facebookUrl?: string | null
          githubUrl?: string | null
          id?: string
          instagramUrl?: string | null
          linkedinUrl?: string | null
          portfolioUrl?: string | null
          updatedAt?: string
          userId?: string
          xUrl?: string | null
          youtubeUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_links_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          clientName: string
          company: string | null
          createdAt: string
          id: string
          photoUrl: string | null
          rating: number | null
          review: string
          sortOrder: number
          updatedAt: string
        }
        Insert: {
          clientName: string
          company?: string | null
          createdAt?: string
          id?: string
          photoUrl?: string | null
          rating?: number | null
          review: string
          sortOrder?: number
          updatedAt: string
        }
        Update: {
          clientName?: string
          company?: string | null
          createdAt?: string
          id?: string
          photoUrl?: string | null
          rating?: number | null
          review?: string
          sortOrder?: number
          updatedAt?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatarUrl: string | null
          createdAt: string
          email: string
          fullName: string | null
          id: string
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Insert: {
          avatarUrl?: string | null
          createdAt?: string
          email: string
          fullName?: string | null
          id?: string
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Update: {
          avatarUrl?: string | null
          createdAt?: string
          email?: string
          fullName?: string | null
          id?: string
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_portfolio_editor: { Args: never; Returns: boolean }
    }
    Enums: {
      BlogStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      ProjectStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      UserRole: "ADMIN" | "EDITOR" | "VIEWER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      BlogStatus: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      ProjectStatus: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      UserRole: ["ADMIN", "EDITOR", "VIEWER"],
    },
  },
} as const
